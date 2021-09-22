let p = new Promise((resolve, reject) => {
    let a = 1 + 3;

    if(a == 3){
        resolve('Success');
    }else{
        reject('Failure');
    }
});

p.then((message) => {
    console.log('This is the then ' + message);
}).catch((message) => {
    console.log('This is the catch ' + message);
})