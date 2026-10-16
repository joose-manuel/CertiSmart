import { HeaderBrand, HeaderStep, HeaderUser } from './header.interface';

export const HEADER_BRAND: HeaderBrand = {
  name: 'CertiSmart',
  subtitle: 'Sistema de Emisión Masiva de Actas',
  version: 'V2.4 PRO',
  logoIcon: 'pi pi-verified',
};

export const HEADER_STEPS: HeaderStep[] = [
  {
    id: 1,
    label: 'Cargar Archivo',
    description: 'Excel / CSV de origen',
    icon: 'pi pi-cloud-upload',
  },
  {
    id: 2,
    label: 'Validar Datos',
    description: 'Revisión y mapeo',
    icon: 'pi pi-check-circle',
  },
  {
    id: 3,
    label: 'Plantilla & Vista Previa',
    description: 'Formato A4 y folios',
    icon: 'pi pi-file-edit',
  },
  {
    id: 4,
    label: 'Exportar Lote',
    description: 'Generación de PDFs',
    icon: 'pi pi-download',
  },
];

export const HEADER_CURRENT_USER: HeaderUser = {
  name: 'Silvia',
  role: 'Secretaría Académica',
  initials: 'SI',
};
