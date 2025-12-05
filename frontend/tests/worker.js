self.addEventListener('push', function(e) {
    console.log(12121414124)
    const data = e.data.json();
    
    console.log(data)
    self.registration.showNotification(
        data.title,
        {
            body: data.body,
        }
    );
})