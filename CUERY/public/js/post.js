/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//timeStamp will be of type Date
function getTimeElapsedString(timeStamp) {
	const minute = 1000 * 60;
	const hour = 1000 * 60 * 60;
	const day = 1000 * 60 * 60 * 24;
    const now = new Date(Date.now());
	const timeElapsed = Date.now() - timeStamp;

	if(timeElapsed < minute) return "just now";
	if(timeElapsed < hour) {
		const temp = Math.floor(timeElapsed / minute);
		if(temp === 1) return temp + " minute ago";
		return temp + " minutes ago";
	}
    if(timeElapsed < day) {
		const temp = Math.floor(timeElapsed / hour);
		if(temp === 1) return temp + " hour ago";
		return temp + " hours ago";
	}
    if(timeElapsed < day * 30) {
		const temp = Math.floor(timeElapsed / day);
		if(temp === 1) return temp + "day ago";
		return temp + " days ago";
	}
    if(timeElapsed < day * 365) {
		const temp = (now.getMonth() - timeStamp.getMonth());
		if(temp === 1) return temp + " month ago";
		return temp + " months ago";
	} 
	const temp = (now.getFullYear() - timeStamp.getFullYear());
	if(temp === 1) return temp + " year ago";
    return  temp + " years ago";
}

// get the user's cookie
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var userCookie = getCookie("x-access-token");

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({userCookie})
};
        
var user;
// check the user's cookie before loading information
// require the user to have cookie before viewing main pages
function userAuthentication() {
fetch('/checkCookie', options).then(res=>res.json())
.then(data=>{
    if (data.answer === 'NA'){
        alert("Please login first : )");
        window.location.href = "login.html";
    }
    else{   // continue loading if user are verified,  can use the user object received in the response
        document.getElementById("useravatar").src = "data:image/png;base64," + data.avatar.data;
        document.getElementById("sidebar-avatar").src = "data:image/png;base64," + data.avatar.data;
        document.getElementById("sidebar-username").innerHTML = data.name;
        document.getElementById("sidebar-email").innerHTML = "(" + data.email + ")";
        document.getElementById("sidebar-year").innerHTML = "Year: " + data.year;
	const userUpdateName = document.getElementById("fixedusername");
        if (userUpdateName){
            userUpdateName.innerHTML = data.name;
        }
        
        // get the total number of posts by the user
        const options2 = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({data})
		};
		fetch("/user/posts/"+data._id,{options2})
		.then(res=>res.json())
		.then(data=>{
			let counter = 0;
			for (let i = 0; i < data.length; i++) 
			counter++;
			document.getElementById("sidebar-postnum").innerHTML = "Total Posts: " + counter;	
		})	
    }
});
}

// also check user's cookies first
function Post_profile() {
	fetch('/checkCookie', options).then(res=>res.json())
	.then(data=>{
		if (data.answer === 'NA'){
			alert("Please login first : )");
			window.location.href = "login.html";
		}
		else{   
			const options2 = {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({data})
			};
			fetch("/user/posts/"+data._id,{options2})
			.then(res=>res.json())
			.then(data=>{
			   document.getElementById("posts").innerHTML="";
			   for(const post of data)AddPost(post);
			})
		}
	});
 }

// a function used when user click the Log out button
function Logout(){
    const option = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({userCookie})
    };
    
    // if successfully log out -> clear the cookie
    fetch('/logout', {method: 'POST'}).then(res=>res.json())
    .then(data=>{
        if (data.note === "success"){
            document.cookie = "x-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // ckear the cookies
            alert("You have successfully logged out.")
            window.location.href = "login.html";
        }
    }).catch(err=>{
        console.log(err);
    });
}

// clicking the Profile button
function toProfile(){
    window.location.href = "user.html";
}

// clicking the main button
function toMain(){
    window.location.href = "main.html";
}

function toPost(){
    window.location.href = "post-profile.html";
}

// clicking the small avatar to toggle sidebar
function toggleSidebar(){
    document.getElementById('sidebar').classList.toggle('sidebar-visible'); 
    document.getElementById('useravatar').classList.toggle('useravatar-visible');
}
 
function toTitleCase(str) {
	var arr=str.split(" "),i=0;
	for(const word of arr) {
		if(word !== "and") arr[i++]=word[0].toUpperCase()+word.slice(1,word.length);
		else arr[i++]=word;
	}
	return arr.join(" ");
}    

function FetchLists() { // fetch topics and categories
	fetch("/lists/topic",{method:"GET"})
	.then(res=>res.json())
	.then(data=>{
		var option,select=document.getElementById("topic");
		for(const topic of data){
			option=document.createElement("option");
			option.value=topic;
			option.innerHTML=toTitleCase(topic);
			select.appendChild(option);
		}
		return fetch("/lists/category",{method:"GET"})})
	.then(res=>res.json())
	.then(data=>{
		var option,select=document.getElementById("category");
		for(const category of data){
			option=document.createElement("option");
			option.value=category;
			option.innerHTML=toTitleCase(category);
			select.appendChild(option);
		}
	})
	.catch(err=>console.log("Error: unable to fetch information.\n",err));
}
function FetchHeader() { // fetch the page header for main.html, newpost.html and viewpost.html
	fetch("../header.html")
	.then(res=>res.text())
	.then(txt=>document.getElementById("header").innerHTML=txt)
	.catch(err=>console.log("Unable to fetch header.\n",err));
}

// clicking the update info button in profile page
function updateUser(){
    window.location.href = "userupdate.html";
}

// check update information when user try to click submit button in change profile page
function checkUserUpdate(){
    let email = document.getElementById("email").value;
    let oldpw = document.getElementById("oldpw").value;
    let pw1 = document.getElementById("password").value;
    let pw2 = document.getElementById("newpw2").value;
    // old password must be inputted by user
    if (oldpw.length === 0){
        alert("Old password is needed.");
        return false;
    }
    if (pw1.length !== 0){
        if (pw1.length < 8 || pw1.length > 18){
            alert("Password must contain 8-18 characters.");
            return false;
        }
        if (pw1 !== pw2 && pw1.length !== 0) {
            alert("Password and Confirm Password must be the same.");
            return false;
        }    
    }
    
    if (pw2.length !== 0){
        if (pw1 !== pw2) {
            alert("Password and Confirm Password must be the same.");
            return false;
        } 
    }
    
    document.getElementById("UpdateForm").action = "update";
    return true;
    
}
