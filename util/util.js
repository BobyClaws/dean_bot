const evenSpace = (text0) => {
    
    let prev = null;
    let result = '';
    let text = text0.trim();
    
    for(let i = 0; i < text.length; i++) {
        letter = text[i];
        if(prev == ' ' && letter == ' ') 
            continue
        result = result.concat(letter);
        prev = letter;
    }
    return result;
}

module.exports = {evenSpace};