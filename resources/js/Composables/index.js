const formatDateTime = (date, includeTime=true) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = new Date(date);

    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = months[formattedDate.getMonth()];
    const year = formattedDate.getFullYear();
    const hours = formattedDate.getHours().toString().padStart(2, '0');
    const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
    const seconds = formattedDate.getSeconds().toString().padStart(2, '0');

    if (includeTime) {
        return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    } else {
        return `${day} ${month} ${year}`;
    }
}

const formatDate = (date, includeTime=false) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = new Date(date);

    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = months[formattedDate.getMonth()];
    const year = formattedDate.getFullYear();
    const hours = formattedDate.getHours().toString().padStart(2, '0');
    const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
    const seconds = formattedDate.getSeconds().toString().padStart(2, '0');

    if (includeTime) {
        return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    } else {
        return `${day} ${month} ${year}`;
    }
}

const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const formatWallet = (name) => {
    if (name === 'dine_in_wallet') {
        return 'Dine In Wallet';
    } else if (name === 'cash_wallet') {
        return 'Cash Wallet';
    }
}

const formatDT12h = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = new Date(date);

    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = months[formattedDate.getMonth()];
    const year = formattedDate.getFullYear();

    let hours = formattedDate.getHours();
    const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 24h to 12h format

    return `${day} ${month} ${year}, ${hours}:${minutes}${period}`;
};

const formatDateTime24H = (date, includeTime = true) => {
    const formattedDate = new Date(date);

    const year = formattedDate.getFullYear();
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = formattedDate.getDate().toString().padStart(2, '0');

    if (includeTime) {
        let hours = formattedDate.getHours();
        const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12; // Convert to 12-hour format (0 becomes 12)

        return `${year}/${month}/${day} ${hours}:${minutes} ${ampm}`;
    } else {
        return `${year}/${month}/${day}`;
    }
};

const formatDateDMY = (date, includeTime = false) => {
    const formattedDate = new Date(date);

    const year = formattedDate.getFullYear();
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = formattedDate.getDate().toString().padStart(2, '0');

    if (includeTime) {
        let hours = formattedDate.getHours();
        const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12; // Convert to 12-hour format (0 becomes 12)

        return `${year}/${month}/${day} ${hours}:${minutes} ${ampm}`;
    } else {
        return `${year}/${month}/${day}`;
    }
};


export {
    formatDateTime, 
    formatDate,
    formatAmount,
    formatWallet,
    formatDateTime24H,
    formatDT12h,
    formatDateDMY,
};