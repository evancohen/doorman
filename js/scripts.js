let $AppendKey = key => {
    let options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    let valid = (Date.now() <= Date.parse(key.expiry)) ? '' : 'table-danger'
    $codes.append(`<tr id="${key['_id']}" class="${valid}"><td>${key.name}</td>  
        <td>${new Date(key.expiry).toLocaleDateString('en-US', options)}</td>
        <td>[${key.pin}]</td>
        <td><a href="" onclick="deleteCode('${key['_id']}')">🗑️</a></dt></tr>`)
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
    DB.deleteCodeByID(id).done(function (results) {
        $("#" + id).remove()
    })
}

let dateOffset = (hours, days, months, years) => {
    let date = new Date()
    date.setHours(date.getHours() + hours)
    date.setDate(date.getDate() + days)
    date.setMonth(date.getMonth() + months)
    date.setFullYear(date.getFullYear() + years)
    return date
}

let generateCode = () => {
    let computedDate = dateOffset($("#hours").val() || 0, $("#days").val() || 0,
        $("#months").val() || 0, $("#years").val() || 0)

    DB.generateCode($("#name").val(), computedDate.toISOString()).done(function (result) {
        $AppendKey(result)
        $a = $("<a>").attr("href", `sms:?body=${result.pin}`)
        $a.attr("class", "btn btn-sm btn-outline-success col-12")
        $a.text("💬 Send as SMS: " + result.pin)
        $("#generated-code").html($a)
    })
}