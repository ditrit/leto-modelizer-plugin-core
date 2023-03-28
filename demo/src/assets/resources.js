export default {
  icons: {
    network: '<svg width="32px" height="32px" viewBox="0 0 24 24"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M14.28,14.08L12.26,16.1C11.66,16.7 10.87,17 10.08,17C9.29,17 8.5,16.7 7.9,16.1C6.7,14.9 6.7,12.95 7.9,11.74L9.15,10.5L9.14,11.06C9.14,11.5 9.21,11.95 9.36,12.37L9.41,12.5L9.04,12.87C8.76,13.15 8.6,13.53 8.6,13.92C8.6,14.32 8.76,14.69 9.04,14.97C9.6,15.53 10.57,15.53 11.13,14.97L13.14,12.96C13.43,12.67 13.58,12.3 13.58,11.91C13.58,11.5 13.43,11.14 13.15,10.86C13,10.71 12.9,10.5 12.9,10.29C12.9,10.08 13,9.88 13.15,9.73C13.45,9.42 14,9.43 14.28,9.73C14.86,10.31 15.18,11.08 15.18,11.9C15.18,12.73 14.86,13.5 14.28,14.08M17.1,11.26L15.85,12.5L15.86,11.94C15.86,11.5 15.79,11.06 15.64,10.64L15.6,10.5L15.96,10.13C16.25,9.85 16.4,9.5 16.4,9.08C16.4,8.69 16.25,8.32 15.97,8.04C15.4,7.47 14.43,7.47 13.87,8.04L11.86,10.05C11.58,10.33 11.42,10.7 11.42,11.1C11.42,11.5 11.57,11.86 11.86,12.14C12,12.29 12.1,12.5 12.1,12.71C12.1,12.93 12,13.13 11.85,13.28C11.7,13.44 11.5,13.5 11.29,13.5C11.09,13.5 10.88,13.43 10.72,13.28C9.5,12.08 9.5,10.12 10.72,8.92L12.74,6.9C13.95,5.7 15.9,5.7 17.1,6.9C17.68,7.5 18,8.26 18,9.08C18,9.9 17.68,10.68 17.1,11.26Z" /></svg>',
    server: '<svg width="32px" height="32px" viewBox="0 0 24 24"><path d="M3,1H19A1,1 0 0,1 20,2V6A1,1 0 0,1 19,7H3A1,1 0 0,1 2,6V2A1,1 0 0,1 3,1M3,9H19A1,1 0 0,1 20,10V10.67L17.5,9.56L11,12.44V15H3A1,1 0 0,1 2,14V10A1,1 0 0,1 3,9M3,17H11C11.06,19.25 12,21.4 13.46,23H3A1,1 0 0,1 2,22V18A1,1 0 0,1 3,17M8,5H9V3H8V5M8,13H9V11H8V13M8,21H9V19H8V21M4,3V5H6V3H4M4,11V13H6V11H4M4,19V21H6V19H4M17.5,12L22,14V17C22,19.78 20.08,22.37 17.5,23C14.92,22.37 13,19.78 13,17V14L17.5,12M17.5,13.94L15,15.06V17.72C15,19.26 16.07,20.7 17.5,21.06V13.94Z" /></svg>',
    laptop: '<svg width="32px" height="32px" viewBox="0 0 24 24"><path d="M20 4C21.1 4 22 4.89 22 6V16C22 17.11 21.11 18 20 18H24V20H0V18H4C2.9 18 2 17.11 2 16V6C2 4.89 2.89 4 4 4H20M20 6H4V16H20V6M12 12C14.21 12 16 12.9 16 14V15H8V14C8 12.9 9.79 12 12 12M12 7C13.11 7 14 7.9 14 9S13.11 11 12 11 10 10.11 10 9 10.9 7 12 7Z" /></svg>',
  },
  models: {
    DefaultModel: `
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
        class="template"
        width="230" height="50"
        fill="#474262">
        <rect class="component-hitbox" width="100%" height="100%" rx="5" ry="5"></rect>
        {% if hasError %}
        <g class="component-error">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 width="15" height="15"
                 x=200 y="10"
                 fill="yellow"
                 viewBox="0 0 512 512">
            <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zm32 224c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32z"/>
            </svg>
        </g>
        {% endif %}
        <g fill="white" style="font-family: Calibri, Arial">
          <rect width="38" height="38"
            x="6" y="6"
            rx="4" ry="4"></rect>
          <text class="component-name"
            x="50" y="1.5em"
            style="font-size: 14px; font-weight: 600">{{ name }}</text>
          <text class="component-type"
            x="50" y="3em"
            style="font-size: 12px; font-style: italic">{{ definition.type }}</text>
        </g>
        <circle class="anchor" r="0" cx="50%" cy="0%" anchor="top"></circle>
        <circle class="anchor" r="0" cx="50%" cy="100%" anchor="bottom"></circle>
        <circle class="anchor" r="0" cx="100%" cy="50%" anchor="right"></circle>
        <circle class="anchor" r="0" cx="0%" cy="50%" anchor="left"></circle>
        <svg id="icon-{{id}}" class="component-icon" x="9" y="9" width="32" height="32"></svg>
      </svg>
    `,
    DefaultContainer: `
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
           overflow="visible"
           class="template"
           width="230" height="68"
           fill="#474262">
        <rect class="component-hitbox" width="100%" height="100%" rx="5" ry="5"></rect>
        {% if hasError %}
        <g class="component-error">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 width="15" height="15"
                 x=200 y="10"
                 fill="yellow"
                 viewBox="0 0 512 512">
            <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zm32 224c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32z"/>
            </svg>
        </g>
        {% endif %}
        <g transform="translate(0,50)">
          <svg class="component-container"
              overflow="visible"
              fill="#9691B1">
            <rect class="container-background"
                  width="100%" height="100%"
                  rx="4" ry="4"></rect>
          </svg>
        </g>
        <g fill="white" style="font-family: Calibri, Arial">
          <rect width="38" height="38"
                x="6" y="6"
                rx="4" ry="4"></rect>
          <text class="component-name"
                x="50" y="1.5em"
                style="font-size: 14px; font-weight: 600">{{ name }}</text>
          <text class="component-type"
                x="50" y="3em"
                style="font-size: 12px; font-style: italic">{{ definition.type }}</text>
        </g>
      
        <circle class="anchor" cx="50%" cy="0%" anchor="top" r="0"></circle>
        <circle class="anchor" cx="50%" cy="100%" anchor="bottom" r="0"></circle>
        <circle class="anchor" cx="100%" cy="50%" anchor="right" r="0"></circle>
        <circle class="anchor" cx="0%" cy="50%" anchor="left" r="0"></circle>
  
        <svg id="icon-{{id}}" class="component-icon" x="9" y="9" width="32" height="32"></svg>
      </svg>
    `,
  },
};
