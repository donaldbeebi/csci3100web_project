function ViewPost(postid) {window.location="/viewpost.html?postid="+postid;}
function AddPost(data) { // data is an object
	var post=document.createElement("div");
	post.style.whiteSpace = "nowrap";
	post.style.overflow = "hidden";

	var p=document.createElement("p");
	var obj=document.createElement("div");
	if(data.votes === 0) colorValue = "grey";
	else if(data.votes < 0) colorValue = "rgb(255, 65, 65)";
	else colorValue = "rgb(34, 160, 255)";
	var voteCount;
	if(Math.abs(data.votes) > 1000) {
		voteCount = (Math.floor(data.votes / 100) / 10).toString() + "k";
	}
	else voteCount = data.votes.toString();
	p.innerHTML = "<span style='color: " + colorValue + ";'>" + voteCount + "</span>";
	p.style.width = "3em";
	p.style.textAlign = "center";
	p.style.margin = "0 auto";
	p.style.marginRight = "0.2em";
	p.style.fontSize="200%";
	post.appendChild(p);

	p=document.createElement("p");
	obj.innerHTML=data.title;
	obj.style.marginBottom = "0.4em";
	p.appendChild(obj);

	obj=document.createElement("div");
	obj.classList.add("text-secondary");
	//parsing date
	const date = new Date(data.createdAt);
	var dateString = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

	//adding category tag
	category = document.createElement("div");
	category.setAttribute("class", "tag");
	category.setAttribute("id", "category_" + data._id);
	category.innerHTML = toTitleCase(data.category);
	category.style.marginRight = "0.5em";
	obj.appendChild(category);

	//adding topic tag
	topic = document.createElement("div");
	topic.setAttribute("class", "tag");
	topic.setAttribute("id", "topic_" + data._id);
	topic.innerHTML = toTitleCase(data.topic);
	topic.style.marginRight = "0.5em";
	obj.appendChild(topic);

	//owner
	obj.insertAdjacentHTML("beforeend", "by " + data.owner + " on " + dateString);

	obj.style.fontSize = "10px";
	p.appendChild(obj);
	post.appendChild(p);
	post.setAttribute("onclick","ViewPost('"+data._id+"');");
	document.getElementById("posts").appendChild(post);
	// can add more information
}

function ReloadPosts(keepPage) {
	// erase all previous posts and disable page changing
	document.getElementById("posts").innerHTML="Loading...";
	document.getElementById("pages").innerHTML="&nbsp;1";
	if(!keepPage)history.pushState({page:1},"page 1","?page=1");
	
	const query = new URLSearchParams(window.location.search);
	const page=(keepPage&&query.has("page"))?query.get("page"):"1";
	const limit=10; // temporary value
	const category=document.getElementById("category").value;
	const topic=document.getElementById("topic").value;
	const sort=document.getElementById("sort").value;
	fetch("/posts?page="+page+"&limit="+limit+"&category="+category+"&topic="+topic+"&sort="+sort,{method:"GET"})
	.then(res=>res.json())
	.then(data=>{
		if(data.length){
			document.getElementById("posts").innerHTML="";
			for(const post of data)AddPost(post);
			return fetch("/count?category="+category+"&topic="+topic,{method:"GET"});
		} else document.getElementById("posts").innerHTML="No posts found :(";
	})
	.then(res=>res.text())
	.then(count=>{
		document.getElementById("pages").innerHTML="";
		var p,pages=document.getElementById("pages");
		const pageCnt=Math.ceil(count/limit);
		for(let i=1;i<=pageCnt;++i){
			p=document.createElement("p");
			p.innerHTML=i;
			p.addEventListener("click",()=>{
				history.pushState({page:i},"page "+i,"?page="+i);
				ReloadPosts(true);
			});
			pages.appendChild(p);
		}
	})
	.catch(err=>console.log("Error: unable to fetch posts and/or pages.\n",err));
}
