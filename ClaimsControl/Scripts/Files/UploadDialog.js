$.ajaxSetup({ cache: false });
$(document).ready(function () {
    $(".openDialog").live("click", function (e) {
        e.preventDefault();

        $("<div></div>")
			.addClass("dialog")
			.attr("id", $(this)
			.attr("data-dialog-id"))
			.appendTo("body")
			.dialog({
			    dialogClass: "fileUploadCloser",
			    title: $(this).attr("data-dialog-title"),
			    width: 900,
			    height: 600,
			    close: function () { $(this).remove() },
			    modal: true
			})
			.load(this.href);
    });

    $(".close").live("click", function (e) {
        e.preventDefault();
        $(this).closest(".dialog").dialog("close");
    });
});
