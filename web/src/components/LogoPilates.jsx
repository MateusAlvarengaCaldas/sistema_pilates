const LogoPilates = () => (
    <svg 
      width="140" 
      height="140" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }}
    >
      {/* Cabeça */}
      <circle cx="12" cy="5" r="2.5" stroke="white" strokeWidth="1.5"/>
      
      {/* Corpo em movimento (Curva da coluna/perna) */}
      <path 
        d="M12 8C12 8 8 11 8 16C8 19 11 21 14 21" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      
      {/* Braços estendidos (Alongamento) */}
      <path 
        d="M15 9C15 9 18 7 20 8" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <path 
        d="M9 9C9 9 6 7 4 8" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      
      {/* Perna de apoio estilizada */}
      <path 
        d="M11 15C11 15 14 15 16 18" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  );
    
export default LogoPilates;