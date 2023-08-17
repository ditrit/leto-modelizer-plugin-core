export default {
  icons: {},
  models: {
    universal: `
      <svg class="model" overflow="visible"
           x="{{ drawOption.x }}"
           y="{{ drawOption.y }}"
           width="{{ drawOption.width }}" 
           height="{{ drawOption.height }}"
      >
      
  
            
      {% if definition.miniMapOption.shape=='rectangle' %}
    <rect class="background"
              stroke="{{definition.miniMapOption.stroke}}"
              stroke-width="7"
              fill="{{definition.miniMapOption.fill}}"
              width="100%" height="100%"
        />
        {% elif definition.miniMapOption.shape=='triangle' %}
    
    <svg viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" fill="{{definition.miniMapOption.fill}}" stroke="{{definition.miniMapOption.stroke}}" >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></g>
    <g id="SVGRepo_iconCarrier">
    <path d="M7.93189 1.24806C7.84228 1.09446 7.67783 1 7.5 1C7.32217 1 7.15772 1.09446 7.06811 1.24806L0.0681106 13.2481C-0.0220988 13.4027 -0.0227402 13.5938 0.0664289 13.749C0.155598 13.9043 0.320967 14 0.5 14H14.5C14.679 14 14.8444 13.9043 14.9336 13.749C15.0227 13.5938 15.0221 13.4027 14.9319 13.2481L7.93189 1.24806Z">
    </path>
     </g>
     </svg>
      
      {% elif definition.miniMapOption.shape=='circle' %}
       <circle cx="50%" cy="50%" r="25" stroke="{{definition.miniMapOption.stroke}}" stroke-width="3" fill="{{definition.miniMapOption.fill}}" />
      {% else %}
      <circle cx="50%" cy="50%" r="20" stroke="{{definition.miniMapOption.stroke}}" stroke-width="3" fill="{{definition.miniMapOption.fill}}" />
      {% endif %}
     
                

        <g class="components" transform="translate(6,80)"></g>

      </svg>
    `,
  },
};
