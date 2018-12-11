
// On Load...
$(function () {
    $codes = $('#codes')
    DB.getCodes().done(function (response) {
        console.log(response);
        let options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        response.forEach(key => {
            let valid = (Date.now() <= Date.parse(key.expiry))? 'valid':'expired'
            $codes.append(`<tr id="${key['_id']}"><td>${key.name}</td>  
            <td class="${valid}">${new Date(key.expiry).toLocaleDateString('en-US', options)}</td>
            <td>[${key.pin}]</td>
            <td><a href="#" onclick="deleteCode('${key['_id']}')">X</a></dt></tr>`)
        });
    });

    // DB.addCode("test", new Date().toISOString(), 1234).done(function(result){
    //     console.log(result)
    // })
});

deleteCode = (id) => {
    DB.deleteCodeByID(id).done(function (results) {
        $("#" + id).remove()
    })
}

let dateOffset = (hours, days, months, years) =>{
    let date = new Date()
    date.setHours(date.getHours()+hours)
    date.setDate(date.getDate()+days)
    date.setMonth(date.getMonth()+months)
    date.setFullYear(date.getFullYear()+years)
    return date
}

generateCode = (date) => {
    let date = new Date()
    date.setHours(date.getHours()+hours_to_be_added); 
    DB.addCode("test", new Date().toISOString(), 1234).done(function (result) {
        console.log(result)
    })
}