export default class LoadingSpinner {
  element: HTMLDivElement;
  constructor () {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    @keyframes load {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    `;
    document.head.appendChild(styleTag);
    this.element = document.createElement("div");
    this.element.id = "loading-spinner";
    const startingStyles = `
    display: none;
    position: relative;
    border: 5px solid #32cd32;
    border-radius: 50%;
    border-left-color: transparent;
    animation: load 1.1s infinite ease;
    width: 90px;
    height: 90px;
    z-index: 100;
  `;
    this.element.setAttribute("style", startingStyles);
  }
  appendTo (parent: HTMLElement) {
    parent.appendChild(this.element);
  }
  show () {
    this.element.style.display = "block";
  }
  hide () {
    this.element.style.display = "none";
  }

}
