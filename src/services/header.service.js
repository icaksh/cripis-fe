
class HeaderService{
     authHeader() {
        let user = JSON.parse(localStorage.getItem('user'));

        if (user && user.token) {
            return { 'Authorization': 'Bearer ' + user.access_token };
        } else {
            return {};
        }
    }
}

export default new HeaderService();