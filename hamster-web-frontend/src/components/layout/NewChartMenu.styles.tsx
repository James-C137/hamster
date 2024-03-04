
export const titleStyle = { fontWeight: 700, fontSize: '1.5rem', textAlign: 'center' } as React.CSSProperties;
export const buttonStyle = {
  width: '100%',
  marginBottom: '10px',
  backgroundColor: 'white',
  borderColor: 'lightgray',
  color: 'black',
  textAlign: 'left',
  padding: '10px',
  height: '70px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // This will center the items vertically
  alignItems: 'center', // This will center the items horizontally
  borderRadius: '15px'    
} as React.CSSProperties;
export const paperStyle = { padding: '1rem', height: '400px' } as React.CSSProperties;
export const subtextStyle = { color: 'lightgray', marginTop: '5px', fontSize: '13px' } as React.CSSProperties;  

export const buttonTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center', // ensures vertical centering
  height: '100%', // takes the full height of the parent button
  fontSize: '18px'
} as React.CSSProperties;

export const buttonSpacing = {
  marginBottom: '10px', // Adjust as needed
} as React.CSSProperties;

export const pageIconStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  margin: '5px 5px',
  outline: '1px solid'
}