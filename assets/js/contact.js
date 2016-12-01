$(window).load(function() {
	var urlParam = window.location.search.substring(1);
	
	if ( urlParam.length ) {
		var currentMessageKey = window.sessionStorage.getItem("Message ID");
		var urlVar = urlParam.split("=");
		var passedMessageKey = urlVar[1];
		if ( currentMessageKey == passedMessageKey ) {
			alert("Message sent successfully. Thanks for getting in touch!");
			window.sessionStorage.clear();
		};
	}
});

$("#ss-form").submit(function() {
	window.sessionStorage.clear();
	sent_txlbrchf = true;
	$(this).attr("target", "iframe_txlbrchf")
	var userEmail = $("#entry_1662483699").val();
	var messageKey =
		userEmail + '_' +
		$.now();
	window.sessionStorage.setItem("Message ID", messageKey);
});

$("#iframe_txlbrchf").on("load", function() {
	var currentMessageKey = window.sessionStorage.getItem("Message ID");
	if ( typeof sent_txlbrchf != "undefined" ) {
		window.location='/contact' + "?messageKey=" + currentMessageKey;
	}
});