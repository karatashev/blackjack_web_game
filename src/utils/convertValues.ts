
  //To convert the cards with string Values
   const convertToNum = (val: string) => {
    if (val === "ACE") {
      return 11;
    } 
    else if (val === "KING" || val === "QUEEN" || val === "JACK") {
      return 10;
    } 
    else {
      return Number(val);
    }
  }
  
export default convertToNum

