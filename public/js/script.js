

const showPass = document.querySelector("#showPass");
if (document.getElementById("account_password")) {
    showPass.addEventListener("click", () => {
    const password = document.getElementById("account_password");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
    });
}

const showPass1 = document.querySelector("#showPass1");
if (document.getElementById("edit_password")) {
    showPass1.addEventListener("click", () => {
    const password = document.getElementById("edit_password");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
    });
}


function checkUrl() {
    const url = window.location.href;
    const hasInvType = url.indexOf("/inv/type/") >= 0;
    const hasInvDetail = url.indexOf("/inv/details/") >= 0;
    if (hasInvType) {
        const link = document.createElement('link');
        const link1 = document.createElement('link');
        link.href = '/css/stylesclassification.css';
        link1.href = '/css/stylesdetail.css';
        link.rel = 'stylesheet';
        link1.rel = 'stylesheet';
        document.head.appendChild(link);
        document.head.appendChild(link1);
    } else if  (hasInvDetail) {
        const link = document.createElement('link');
        link.href = '/css/stylesdetail.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
}
    checkUrl();


document.querySelector(".menu-btn").addEventListener("click", () => {
    document.querySelector(".nav-menu").classList.toggle("show");
});

document.querySelector(".andale").addEventListener("click", () => {
    document.querySelector("span").classList.toggle("show");
    document.querySelector("span:nth-child(2)").classList.toggle("blck");
});

// if (document.cookie) {
//     document.querySelector("#tools").innerHTML = 
// }