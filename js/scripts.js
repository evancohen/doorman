
$(function () {
    $codes = $('codes')
    DB.getCodes().done(function (response) {
        console.log(response);
        response.forEach(key => {
            $codes.append(`<li><strong>${key.name}</strong>[${key.pin}] Expires: ${key.expiry}</li>`)
        });
    });
});

