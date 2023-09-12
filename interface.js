export class Interface {
  constructor (element='body') {
    let el = document.createElement('main');
    el.innerHTML = `
      <h2>Simple Interface</h2>      
      <div class="output">
      </div>
    `    
    document.querySelector(element).appendChild(el);    
    this.outEl = el.querySelector('.output');
    console.log('outEl=',this.outEl)
  }

  writeText (text) {
    let div = document.createElement('div');
    div.textContent = text;
    this.outEl.appendChild(div);
  }

  append (element) {
    this.outEl.appendChild(element);
  }

  writeObject (json) {
    let pre = document.createElement('pre');
    pre.innerText = JSON.stringify(json,null, "  ");
    this.outEl.appendChild(pre);
  }


}