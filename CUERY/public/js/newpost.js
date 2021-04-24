function CreatePost() {
	var data = {
		title:document.getElementById("newtitle").value,
		category:document.getElementById("category").value,
		topic:document.getElementById("topic").value,
		content:document.getElementById("newcontent").value
	};
		const options = {
        method: 'POST',
            headers: 
			{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        };
	fetch("/posts",options)
	.then(res=>res.json())
	.then(res=>{
		alert('Post creation success !');
		window.location.href = "/viewpost.html?postid=" + res._id;
	})
	.catch(err=>console.log(err));
}
