fetch('/current')
    .then(res => res.json())
    .then(res => {
        console.log(res)
    })
