import Guarded from '../components/Guarded';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <Guarded roles={['DOCTOR']}>{children}</Guarded>;
}
