let $AppendKey = key => {
    let options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    let valid = (Date.now() <= Date.parse(key.expiry)) ? '' : 'table-danger'
    $codes.append(`<tr id="${key['_id']}" class="${valid}"><td>${key.name}</td>  
        <td>${new Date(key.expiry).toLocaleDateString('en-US', options)}</td>
        <td>[${key.pin}]</td>
        <td><button class="btn btn-sm btn-danger" onclick="deleteCode('${key['_id']}')">🗑️</button></dt></tr>`)
}

// On Load...
$(function () {
    $codes = $('#codes')
    DB.getCodes().done(function (response) {
        console.log(response);
        response.forEach($AppendKey);
    });

    // DB.addCode("test", new Date().toISOString(), 1234).done(function(result){
    //     console.log(result)
    // })
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
    let computedDate = dateOffset($("#hours").val() || 0, $("#days").val() || 0,
        $("#months").val() || 0, $("#years").val() || 0)

    // Disable button
    $("#generate-button").prop("disabled", true);
    DB.generateCode($("#name").val(), computedDate.toISOString()).done(function (result) {
        // Create SMS link and append to page
        $AppendKey(result)
        $a = $("<a>").attr("href", `sms:?body=${result.pin}`)
        $a.attr("class", "btn btn-sm btn-outline-success col-12")
        $a.text("💬 Send as SMS: " + result.pin)
        $("#generated-code").html($a)
        // Re-enable button
        $("#generate-button").prop("disabled", false);
    })
}