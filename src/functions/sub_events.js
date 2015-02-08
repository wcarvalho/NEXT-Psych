
chooseEvent = function(type){
	if (type === "Clear")
		clearEvent();
	if (type === "Timed")
		timedEvent();
	if (type === "Feedback")
		feedbackEvent();
	if (type === "Key")
		keyEvent();
	if (type === "TimedKey")
		timedKeyEvent();	
}