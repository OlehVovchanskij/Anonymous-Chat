let socket = io()
let color
let id
let userName
// let avatarColor
const usernameRegex = /^[a-zA-Zа-яА-Я0-9_.]/
const validateUser = userName => {
	if (userName.match(usernameRegex)) {
		return true
	}
}
$('.submitBtn').on('click', e => {
	e.preventDefault()
	let userName = $('.userName').val()
	if (userName) {
		if (validateUser(userName)) {
			color = randomColor({
				luminosity: 'dark',
				hue: 'random',
			})
			id = new Date().getTime()
			userName = $('.userName').val()
			$('.login__popup').removeClass('active')
		}
	}
	return false
})
socket.on('getStatus', function (data) {
	$('.usersCount').html(data)
})
$('#form').submit(function () {
	if ($('#message__info').val()) {
		socket.emit('chat message', {
			msg: $('#message__info').val(),
			color: color,
			id: id,
			userName: $('.userName').val(),
			avatarColor: color,
		})
		$('#message__info').val('')
		return false
	} else return false
})
socket.on('login', function (props) {
	userName = props[0]
	id = props[2]
	color = props[1]
})
socket.on('chat message', function (props) {
	$('.msgContainer').append(
		`<div class="msgBox" data-id="${props.id}">
    <div style="background-color:${
			props.avatarColor
		} " class="avatar">${props.userName[0].toUpperCase()}</div>
    <div style="background-color:${props.color} " class="msg">${props.msg}</div>
  </div>`
	)
})

$('.clearBtn').on('click', () => {
	$('.msgContainer').html('')
})
let targetNode = $('.msgContainer')[0]

// Options for the observer (which mutations to observe)
let config = { childList: true };

// Callback function to execute when mutations are observed
let callback = function(mutationsList) {
	for(let mutation of mutationsList) {
		if (mutation.type == 'childList') {
			let msges = document.querySelectorAll('.msg')

			msges.forEach(item => {
				let msgBox = item.parentNode
				let dataId = $(msgBox).attr('data-id')

				if (dataId.toString() === id.toString()) {
					$(msgBox).addClass('my-msg')
				}
			})
		}

	}
};
let observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);



// $('.msgContainer').on('DOMSubtreeModified', e => {
// 	let msges = document.querySelectorAll('.msg')
//
// 	msges.forEach(item => {
// 		let msgBox = item.parentNode
// 		let dataId = $(".msgBox").attr('data-id')
// 		console.log(dataId)
// 		if (dataId.toString() === id.toString()) {
// 			$(".msgBox").addClass('my-msg')
// 		}
// 	})
// 	console.log()
// 	$('.msgContainer').scrollTop($('.msgContainer')[0].scrollHeight)
// })

// emojy

fetch(
	'https://emoji-api.com/categories/smileys-emotion?access_key=5d72a47bf1e9ccfb6582936b646037563091f028'
)
	.then(response => {
		return response.json()
	})
	.then(data => {
		data.forEach(item => {
			$('.modal_emojy').append(
				`<div class='emojy_item' data_name='${item.slug}'> ${item.character}</div>`
			)
		})
	})
$('.emojy_menu').click(() => {
	$('.modal_emojy').toggleClass('active')
})
$('.modal_emojy').click(e => {
	$('.message__info').val($('.message__info').val() + e.target.innerText)
})

// wallpapers
let wallpaper = ''
fetch('./basic_wallpapers.json')
	.then(response => response.json())
	.then(data => {
		localStorage.getItem('wallpaper')
			? (wallpaper = localStorage.getItem('wallpaper'))
			: (wallpaper = data[0])
		$('.wrap').css('background-image', `url(${wallpaper})`)

		console.log(localStorage.getItem('wallpaper'))

		data.forEach(item => {
			$('.basic__wallpaper__box').append(
				`<div class="wallpaper__item" data-url="${item}" style="background-image: url(${item});"></div> `
			)
			$('.wallpaper__item').click(e => {
				wallpaper = e.target.dataset.url
				localStorage.setItem('wallpaper', wallpaper)
				$('.wrap').css('backgroundImage', `url(${wallpaper})`)

				$('.wallpaper__state').attr('src', wallpaper)
				$('.change_wallpaper__popup').removeClass('active')
			})
		})

		$('.wallpaper__state').attr('src', wallpaper)
	})
$('.change_wallpaper').click(() => {
	$('.change_wallpaper__popup').addClass('active')
})
$('.closeBtn').click(() => {
	$('.change_wallpaper__popup').removeClass('active')
})

$('.submit__custom__wallpapers').click(e => {
	e.preventDefault()
	wallpaper = $('.input__walpaper__url').val()
	$('.wrap').css('backgroundImage', `url(${wallpaper}`)
	$('.input__walpaper__url').val('')
	localStorage.setItem('wallpaper', wallpaper)
	$('.change_wallpaper__popup').removeClass('active')
})
