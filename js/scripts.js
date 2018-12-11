
$(function () {
    $codes = $('codes')
    DB.getCodes().done(function (response) {
        console.log(response);
        response.forEach(key => {
            $codes.append(`<li><strong>${key.name}</strong>[${key.pin}] Expires: ${key.expiry}</li>`)
        });
    });

    // DB.addCode("test", new Date().toISOString(), 1234).done(function(result){
    //     console.log(result)
    // })
});

