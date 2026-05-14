import ProjectModel from '../models/ProjectModel';
import TaskModel from '../models/TaskModel';

export async function seedDatabase(): Promise<void> {
  const projectCount = await ProjectModel.count();
  if (projectCount > 0) return;

  const p1 = await ProjectModel.create({ name: 'Sistema de Facturación', description: 'Desarrollo del módulo de facturación electrónica para clientes corporativos.' });
  const p2 = await ProjectModel.create({ name: 'App Móvil E-Commerce', description: 'Aplicación móvil para ventas en línea con integración de pasarela de pagos.' });
  const p3 = await ProjectModel.create({ name: 'Portal de Recursos Humanos', description: 'Portal interno para gestión de empleados, vacaciones y nómina.' });

  await TaskModel.bulkCreate([
    { title: 'Diseñar base de datos', description: 'Modelar entidades: facturas, clientes, productos y pagos.', status: 'completed', projectId: p1.id },
    { title: 'Desarrollar API REST', description: 'Implementar endpoints CRUD para facturas y líneas de detalle.', status: 'in_progress', projectId: p1.id },
    { title: 'Integrar firma electrónica', description: 'Conectar con el servicio de firma digital del proveedor.', status: 'pending', projectId: p1.id },
    { title: 'Pruebas de aceptación', description: 'Validar flujo completo de emisión con clientes piloto.', status: 'pending', projectId: p1.id },

    { title: 'Diseño de pantallas en Figma', description: 'Wireframes y prototipos para las vistas principales de la app.', status: 'completed', projectId: p2.id },
    { title: 'Configurar React Native', description: 'Setup del proyecto, dependencias y configuración de entorno.', status: 'completed', projectId: p2.id },
    { title: 'Módulo de carrito de compras', description: 'Implementar lógica de agregar, quitar y confirmar pedidos.', status: 'in_progress', projectId: p2.id },
    { title: 'Integrar pasarela de pagos', description: 'Conectar Stripe para pagos con tarjeta y Apple Pay.', status: 'pending', projectId: p2.id },

    { title: 'Levantamiento de requisitos', description: 'Entrevistas con el departamento de RRHH para definir alcance.', status: 'completed', projectId: p3.id },
    { title: 'Módulo de empleados', description: 'CRUD completo para registro y gestión de personal.', status: 'in_progress', projectId: p3.id },
    { title: 'Módulo de vacaciones', description: 'Solicitud, aprobación y control de días de vacaciones.', status: 'pending', projectId: p3.id },
  ]);

  console.log('Datos de ejemplo insertados correctamente.');
}
