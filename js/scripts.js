let $PrependKey = key => {
    let options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    let valid = (Date.now() <= Date.parse(key.expiry)) ? '' : 'table-danger'
    $codes.prepend(`<tr id="${key['_id']}" class="${valid}"><td>${key.name}</td>  
        <td>${new Date(key.expiry).toLocaleDateString('en-US', options)}</td>
        <td>[${key.pin}]</td>
        <td><button class="btn btn-sm btn-danger" onclick="deleteCode('${key['_id']}')">🗑️</button></dt></tr>`)
}

// On Load...
$(function () {
    $codes = $('#codes')
    DB.getCodes().done(function (response) {
        response.forEach($PrependKey);
    });
});

let deleteCode = (id) => {
    $("#" + id).remove()
    DB.deleteCodeByID(id).done(function (results) {
        console.log('Removed', results)
    })
}

let dateOffset = (hours, days, months, years) => {
    let date = new Date()
    date.setHours(date.getHours() + parseInt(hours))
    date.setDate(date.getDate() + parseInt(days))
    date.setMonth(date.getMonth() + parseInt(months))
    date.setFullYear(date.getFullYear() + parseInt(years))
    return date
}

let generateCode = () => {
    $("#generate-button").prop("disabled", true);
    let computedDate = dateOffset($("#hours").val() || 0, $("#days").val() || 0,
        $("#months").val() || 0, $("#years").val() || 0)

    // Disable button
    DB.generateCode($("#name").val(), computedDate.toISOString()).done(function (result) {
        // Create SMS link and append to page
        $PrependKey(result)
        let smsBody = `Your access code is '${result.pin}'.`
        $a = $("<a>").attr("href", `sms:?body=${encodeURIComponent(smsBody)}`)
        $a.attr("class", "btn btn-sm btn-outline-success col-12")
        $a.text("💬 Send as SMS: " + result.pin)
        $("#generated-code").html($a)
        // Re-enable button and clear form
        $('#generate').trigger("reset");
        $("#generate-button").prop("disabled", false);
    })
}

let saveSettings = () => { 
    localStorage.setItem("API_KEY",$("#key").val());
    localStorage.setItem("URL",$("#url").val());
    location.reload();
}