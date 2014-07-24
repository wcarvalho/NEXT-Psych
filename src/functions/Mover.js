function Mover(id){
	
	this.setId = function(id){
		if (typeof id !== "undefined"){
			this.id = id;
			this.element = document.getElementById(id);
			this.style = this.element.style;
		}
	}
	this.setId(id);

	this.move = function(where){
		document.getElementById(where).appendChild(this.element);
	}

	this.show = function(){
		this.style.display = "";
	}

	this.hide = function(){
		this.style.display = "none";
	}

}


