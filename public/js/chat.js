const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages')
const $location = document.querySelector('#location')
const $sidebar = document.querySelector('#sidebar')
//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const usersListTemplate = document.querySelector('#users-list-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.emit('join', {username, room}, error => {
    if(error) {
        alert(error)
        location.href= "/"
    }

})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(usersListTemplate, {room, users})
    $sidebar.insertAdjacentHTML('beforeend', html)
})

socket.on('greeting', message =>{
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', data => {
    const html = Mustache.render(locationMessageTemplate, {
        username: data.username,
        url: data.url,
        createdAt: moment(data.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', e => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error)
        return console.log(error)

        console.log('Message delivered!')
    })

})

$sendLocationButton.addEventListener('click', () =>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')


    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', 
        {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
            $sendLocationButton.removeAttribute('disabled')
        } 
          
        )
    })
})