module.exports = (args, arr) => {
    let time = 0
    let newarr = arr
    function Check(val) {
        if (val.match(/\d+/) === null) return false

        else return true
    }
    // Conv Days
    if (args.find(o => o.includes('d'))) {
        let days = args.find(o => o.includes('d'))
        if (Check(days) !== false) {
        days = days.match(/\d+/)[0];
        days = days * 86400000 // 86,400,000
        time = time + days
        newarr.splice(args.indexOf(args.find(o => o.includes('d'))), 1)
        }
    }
    // Conv Hours
    if (args.find(o => o.includes('h'))) {
        let hours = args.find(o => o.includes('h'))
        if (Check(hours) !== false) {
         hours = hours.match(/\d+/)[0];
        hours = (hours * 3600000) //  3,600,000
        time = time + hours  
        newarr.splice(newarr.indexOf(args.find(o => o.includes('h'))), 1)
        }

    }
    // Conv Minutes
    if (args.find(o => o.includes('m'))) {
        let minutes = args.find(o => o.includes('m'))
        if (Check(minutes) !== false) {
            minutes = minutes.match(/\d+/)[0];
            minutes = parseInt(minutes)
            minutes = minutes * 60000 // 60,000
            time = time + minutes
            newarr.splice(newarr.indexOf(args.find(o => o.includes('m')), 1), 1)
        }
    }
    function dhm(t){
        var cd = 24 * 60 * 60 * 1000,
            ch = 60 * 60 * 1000,
            d = Math.floor(t / cd),
            h = Math.floor( (t - d * cd) / ch),
            m = Math.round( (t - d * cd - h * ch) / 60000),
            pad = function(n){ return n < 10 ? '' + n : n; };
      if( m === 60 ){
        h++;
        m = 0;
      }
      if( h === 24 ){
        d++;
        h = 0;
      }
      d = (d !== 0) ? d + 'd' : ''
      h = (h !== 0) ? h + 'h' : ''
      m = (m !== 0) ? m + 'm' : ''
      return [d, pad(h), pad(m)].join('');
    }
    const readable = dhm(time)
    return {
        newarr,
        time,
        readable
    }
}