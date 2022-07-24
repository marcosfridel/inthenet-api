/* const send = (res, action, method, params) => {
    let form = `<form action="${action}" name="redirect" method="${method ? method : "get" }" style="display:none;">`;

    Object.keys(params).map((key) => {
        form += `<input type="hidden" name="${key}" value="${params[key]}" /></form>`;
    })
    //form += `<input type="hidden" name="token" value="${result.token.token}" /></form>`;
    form += `</form>`;
    form += `<script>document.forms['redirect'].submit()</script>`;
    res.send(form);
} */

const send = (res, action, method) => {
    let form = `<form action="${action}" name="redirect" method="${method ? method : "get" }" style="display:none;">`;

/*     Object.keys(params).map((key) => {
        form += `<input type="hidden" name="${key}" value="${params[key]}" /></form>`;
    })
 */    //form += `<input type="hidden" name="token" value="${result.token.token}" /></form>`;
    form += `</form>`;
    form += `<script>document.forms['redirect'].submit()</script>`;
    res.send(form);
}

module.exports = {
    send
}