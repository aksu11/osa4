
const dummy = (blogs) => {
    	return 1
}

const totalLikes = (blogs) => {
	let sum = 0
	blogs.map(blog => sum += blog.likes)
	return sum
}

const favouriteBlog = (blogs) => {
	let obj = {"likes": 0}
	blogs.map(blog => blog.likes > obj.likes ? obj = blog : obj = obj)
	return obj
}

const mostBlogs = (blogs) => {
	let arr = []
	let arrNames = []
	blogs.map(blog => {
		if(arr[blog.author] === undefined) {
			arr[blog.author] = 1
			arrNames.push(blog.author)
		} 
		else arr[blog.author]++
	})

	let apu = 0
	let obj = {author: '', blogs : 0}
	arrNames.map(name => {
		if(arr[name] > apu){
			apu = arr[name]
			obj.author = name
			obj.blogs = apu
		}
	}
	)
	return obj
}

const mostLikes = (blogs) => {
	let arr = []
	let arrNames = []
	blogs.map(blog => {
		if (arr[blog.author] === undefined) {
			arr[blog.author] = blog.likes
			arrNames.push(blog.author)
		} 
		else arr[blog.author] += blog.likes
	})

	let apu = 0
	let obj = {author: '', likes : 0}
	arrNames.map(name => {
		if (arr[name] > apu) {
			apu = arr[name]
			obj.author = name
			obj.likes = apu
		}
	})
	return obj
}


module.exports = {
    dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}