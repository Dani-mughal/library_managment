function vallidatrionPassword(){
    
    let password=document.getElementById("password").value;
    let confirmPassword=document.getElementById("confirm-password").value;
    if(password!=confirmPassword){
        alert("Passwords do not match");
        return false;
    }
    return true;
}