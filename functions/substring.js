module.exports = (value, type='channel') => {
    const numbers = new RegExp("^[0-9]+$");
    let finished = ''
    if (type === 'channel') {
        const channelb = value.substring(2);
        finished = channelb.substring(0, channelb.length - 1)
        if (numbers.test(finished) === false) return finished = false
        return finished
    }
    if (type === 'role') {
        const channelb = value.substring(3);
        finished = channelb.substring(0, channelb.length - 1)
        if (numbers.test(finished) === false) return finished = false
        return finished
    }
    return finished
}