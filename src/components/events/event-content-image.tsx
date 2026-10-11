export default function EventContentImage({src,alt,width=100}:{src:string;alt:string;width?:number}) {
 return <figure className="mt-6 max-w-full" style={{width:Math.min(100,Math.max(20,width))+"%"}}><img src={src} alt={alt} loading="eager" decoding="async" className="block h-auto w-full max-w-full" /></figure>;
}
