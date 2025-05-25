const phoneUtils = {
    formatPhoneNumber: function(input) {
        let numbers = input.replace(/\D/g, '');
        if (numbers.startsWith('7') || numbers.startsWith('8')) {
            numbers = '7' + numbers.substring(1);
        }
        if (numbers.startsWith('9')) {
            numbers = '7' + numbers;
        }
        let formatted = '+7';
        if (numbers.length > 1) {
            formatted += ' (' + numbers.substring(1, 4);
        }
        if (numbers.length > 4) {
            formatted += ') ' + numbers.substring(4, 7);
        }
        if (numbers.length > 7) {
            formatted += ' ' + numbers.substring(7, 9);
        }
        if (numbers.length > 9) {
            formatted += '-' + numbers.substring(9, 11);
        }
        return formatted;
    }
}; 