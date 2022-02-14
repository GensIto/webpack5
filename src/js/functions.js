import $ from "jquery";

export default {
    addNewText(to, input) {
        let text = $(input).val();
        $(to).append("<p>" + text + "</p>");
        $(input).val("");
    },
};