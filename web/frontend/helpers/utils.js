import {format, startOfYesterday, startOfToday, endOfToday, endOfYesterday, startOfYear, endOfYear } from "date-fns"
export function generateCodes(length) {
	if (!length) length = 10
	let randomString = function (length) {

		let text = ''

		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		}

		return text
	}

	// random string length
	const code = randomString(length)

	return code.toUpperCase()
}

export function copyToClipboard(el) {
	// Get the text field
	const copyText = document.querySelector(el)

	// Select the text field
	copyText.select()

	// Copy the text inside the text field
	document.execCommand("copy")
}

export function formatMoney(number) {
	number = Number(number).toLocaleString('en', {
		style: 'currency',
		currency: 'USD'
	})
	return number.replace(/\s/, '')
}

export function titleCase(str) {
	return str.toLowerCase().split(' ').map(function (word) {
		return (word.charAt(0).toUpperCase() + word.slice(1))
	}).join(' ')
}

export function generateRandomID(number) {
	return (Math.random() * number).toString(8).substr(2, 12)
}


export function debounce(func, wait, immediate) {
	var timeout
	return function () {
		var context = this, args = arguments
		var later = function () {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}

export function isEmpty(value) {
	if (Array.isArray(value)) {
		return value.length === 0
	} else {
		return value === '' || value == null
	}
}

export function getGreetingTime() {
	let d = new Date()
	let time = d.getHours()
	let message

	if (time < 12) {
		message = 'Good morning'
	}
	if (time >= 12 && time < 17) {
		message = 'Good afternoon'
	}

	if (time >= 17) {
		message = 'Good evening'
	}

	return message
}

export function getImageSizeHardCrop(src, size) {
	if (!src) return ''
	if (size === null) {
		return src
	}

	if (size === 'master') {
		return src.replace(/http(s)?:/, '')
	}

	const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i)

	if (match) {
		const prefix = src.split(match[0])
		const suffix = match[0]

		return `${prefix[0]}_${size}_crop_center@2x${suffix}`.replace(/http(s)?:/, '')
	} else {
		return null
	}
}

export function removeElementFromArray(arr, index) {
	arr.splice(index, 1)
	return arr
}

const queryString = window.location.search
export const urlParams = new URLSearchParams(queryString)

export function getURLParams() {
	const queryString = window.location.search
	let params = {}
	const urlParams = new URLSearchParams(queryString)
	for (const entry of urlParams.entries()) {
		params[entry[0]] = entry[1]
	}
	return params
}

export function getParam(name) {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	return urlParams.get(name)
}

export function updateParam(key, value, type = null) {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	const {location} = window
	var baseUrl = [location.protocol, '//', location.host, location.pathname].join('')

	if (urlParams.has(key)) {
		if (value !== '' && value !== 'undefined') {
			urlParams.set(key, value)
		}
		if (value === '' || value === 'undefined') {
			urlParams.delete(key)
		}
	} else {
		if (value) urlParams.append(key, value)
	}

	if (type === 'reload') {
		window.location.href = baseUrl + '?' + urlParams.toString()
	} else {
		window.history.replaceState({}, "", baseUrl + '?' + urlParams.toString())
	}
	return false
}

export function clearAllParams() {
	const {location} = window
	const baseUrl = [location.protocol, '//', location.host, location.pathname].join('')
	window.history.replaceState({}, "", baseUrl)
	return false
}

export function checkRequiredFields(required, data) {
	let error = []
	console.log(required, 'requiredFields')
	return new Promise(resolve => {
		required.map(f => {
			console.log(data[f], f, 'data[f]')
			if (Array.isArray(data[f]) && data[f].length === 0) error.push(f)
			if (!data[f]) error.push(f)
		})
		console.log(error, 'error')
		resolve(error)
	})
}

export function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result.split(';base64,')[1])
		reader.onerror = error => reject(error)
		reader.readAsDataURL(file)
	})
}

export function discountMap(type, value) {
	let discount
	switch (type.toLowerCase()) {
		case 'percentage':
			discount = `${value}% off on each product`
			break
		case 'fixed_amount':
			discount = `$${value} off on each product`
			break
		default:
			discount = 'None'
	}
	return discount
}

export function lightOrDark(color) {

	// Variables for red, green, blue values
	var r, g, b, hsp

	// Check the format of the color, HEX or RGB?
	if (color.match(/^rgb/)) {

		// If RGB --> store the red, green, blue values in separate variables
		color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)

		r = color[1]
		g = color[2]
		b = color[3]
	} else {

		// If hex --> Convert it to RGB: http://gist.github.com/983661
		color = +("0x" + color.slice(1).replace(
			color.length < 5 && /./g, '$&$&'))

		r = color >> 16
		g = color >> 8 & 255
		b = color & 255
	}

	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	hsp = Math.sqrt(
		0.299 * (r * r) +
		0.587 * (g * g) +
		0.114 * (b * b)
	)

	// Using the HSP value, determine whether the color is light or dark
	if (hsp > 127.5) {

		return 'light'
	} else {

		return 'dark'
	}
}

export const compareVersions = (v1, v2) => Number(v2?.replace(/\./g, '')) - Number(v1?.replace(/\./g, ''))

export const formatDate = (date, showTime) => {
	const d = new Date(date)
	if (showTime) return `${format(d, 'MMM dd')} at ${format(d, 'hh:mm aaa')}`
	return `${format(d, 'MMM dd')}`
}

export function stripHtml(html) {
	let tmp = document.createElement("DIV")
	tmp.innerHTML = html
	return tmp.textContent || tmp.innerText || ""
}

export const sortBy = (arr, k, v) => arr.concat().sort((a, b) => (a[k].indexOf(v) + 1 ? -1 : 0))
export const getDate = (date) => {
	switch (date) {
		case "today":
			return {start: startOfToday(), end: endOfToday()}
		case "yesterday":
			return {start: startOfYesterday(), end: endOfYesterday()}
		case "last_7_days":
			return {start: new Date(new Date().setDate(new Date().getDate() - 7)), end: new Date(new Date().setDate(new Date().getDate() - 1))}
		case "last_30_days":
			return {start: new Date(new Date().setDate(new Date().getDate() - 30)), end: new Date(new Date().setDate(new Date().getDate() - 1))}
		case "last_90_days":
			return {start: new Date(new Date().setDate(new Date().getDate() - 90)), end: new Date(new Date().setDate(new Date().getDate() - 1))}
		case "last_year":
			return {start: startOfYear(new Date(new Date().setFullYear(new Date().getFullYear() - 1))), end: endOfYear(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))}
			default:
			break;
	}
}
