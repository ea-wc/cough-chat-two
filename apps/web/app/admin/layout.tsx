import Guarded from '../components/Guarded';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Guarded roles={['ADMIN']}>{children}</Guarded>;
}
