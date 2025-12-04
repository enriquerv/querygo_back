
// Importar modelos de Sequelize
const Chat = require('../models/Chat');
const Conversation = require('../models/Conversation');
const InvoiceFolios = require('../models/InvoiceFolios.js');
const Clients = require('../models/Clients.js');
const FinalMasters = require('../models/FinalMasters.js');
const FinalHouses = require('../models/FinalHouses.js');
const Revalidations = require('../models/Revalidations.js');
const InvoiceExits = require('../models/InvoiceExits.js');
const RevaCancelations = require('../models/RevaCancelations.js');
const CIClients = require('../models/CIClients.js');
const InvoiceCores = require('../models/InvoiceCores.js');
const CheckoutPayments = require('../models/CheckoutPayments.js');
const CPaymentConditions = require('../models/CPaymentConditions.js');
const CPaymentTypes = require('../models/CPaymentTypes.js');
const CCfdiTypes = require('../models/CCfdiTypes.js');
const Agents = require('../models/Agents.js');
const CExitTypes = require('../models/CExitTypes.js');
const OtherExitTypes = require('../models/OtherExitTypes.js');
const InvoiceWarehouses = require('../models/InvoiceWarehouses.js');
const MenuModules = require('../models/MenuModules.js');
const UserPermissions = require('../models/UserPermissions.js');
// Importar la lógica del motor de Query Go (Text-to-SQL y Reportes)
const { generateQueryFromPrompt } = require('../services/openaiService');
const { executeQueryAndGenerateReport } = require('../services/dataServices');


// 💡 NOTA: Reemplaza esto con la obtención real del esquema de la base de datos
// Por ahora, usamos el esquema codificado como placeholder
const TEMP_DB_SCHEMA = `
      ----Tablas----

      ### agents
      agents (id, code, name, created_at, updated_at, deleted_at)

      ### c_cfdi_types
      c_cfdi_types (id, name, code, created_at, updated_at, deleted_at)

      ### c_exit_types
      c_exit_types (id, name, code, created_at, updated_at, deleted_at)

      ### checkout_payments
      checkout_payments (id, checkout_id, invoice_id, invoice_type, type, amount, reference, observations, checkout_user_id main_checkout_user_id, voucher_status, created_at, updated_at, deleted_at)

      ### c_i\_clients
      c_i\_clients (id, nput_semih, select_cp, redit_acount, cfdi, select_client, agent_id, Observaciones, invoice_exit_id, method_payment, created_at, updated_at, deleted_at)

      ### clients
      clients (id, number_client, name, rfc, phone, street, zip_code, city, state, municipality, colony, country, mail, payment_account, payment_condition, payment_method, prefix, created_at, updated_at, deleted_at)

      ### c_payment_conditions
      c_payment_conditions (id, name, code, created_at, updated_at, deleted_at)

      ### c_payment_types
      c_payment_types (id, name, code, created_at, updated_at, deleted_at)

      ### final_houses
      final_houses (id, line1, line2, final_master_id, hbs, entry_date, origin_iata_id, destination_iata_id, pieces, total_pieces, weight, total_weight, merchandise_type_id, inner_pieces, description, text_description, shipper_id, consignee_id, from_sira, from_skychain, created_at, updated_at, deleted_at)

      ### final_masters
      final_masters (id, awb, entry_date, origin_iata_id, destination_iata_id, total_pieces, pieces, total_weight, weight, volume,  description, waste, merchandise_type_id, shipper_id, consignee_id, extra, routing_origin_iata_id, routing_origin_airline, future_flight, routing_destination_iata_id, routing_destination_airline, account_info, account_info_id, account_info_info, agent_name, street_line, agent_account_num, agent_account_num1, agent_account_num2, observation, currency, charge_code, charge_value, declared_value, customs_value, insurance_amount, rate_pieces, rate_weight, rate_tariff, rate_weight_collect, rate_charge, rate_total, rate_natural_of_goods, rate_natural_of_goods_svc, prepaid_weight, due_carrier, col_wt, col_vc, col_tx, col_oc, col_ct, cer, isu_date, isu_origin, isu_destination, isu_description, cdc_line1, cdc_line2, cdc_line3, cdc_line4, ref_line1, ref_line2, ref_line3, ref_line4, ref_line5, sph, cor, ard, uld, due_total_carrier, entry_type_id, from_sira, from_skychain, created_at,updated_at, deleted_at)

      ### invoice_cores
      invoice_cores (id, id_invoice, type_invoice, code, message, timbrado_flag, contabilizador_flag, sello, noCertificado, certificado, sello_cfd, uuid, fecha_timbrado, sello_sat, cancel, canceled_at, cancel_type_code, referenced_uuid, referenced_folio, reinvoice_code, had_error, created_at, updated_at, deleted_at)

      ### invoice_exits
      invoice_exits (id, final_master_id, final_house_id, agent_id, invoice_warehouse_id, client_id, payment_account, c_payment_condition_id, c_cfdi_type_id, c_payment_type_id, c_exit_type_id, other_exit_type_id, observations, custom_value, comercial_value, extraordinary, lift_truck_id, lift_assigned_at, exit_parciality_id, amount_preve, amount_maneuver, amount_custody, amount_storage, amount_merchandise_rec, amount_extraordinary, amount_refri, amount_conge, amount_hum, amount_rkn, amount_rap, subtotal, iva, total, exit_date, start_service, last_attention, created_at, updated_at, deleted_at)

      ### invoice_folios 
      invoice_folios (id, number, user_id, client_id, final_master_id, final_house_id, date, timbered_at, accounted_at, exchange, iva, total, reva, desco, destiny_charges, preves, min_charges, maneuver, custody, storage, refri, frozen, extra_service, cancel_invoice, hum, rkn, rap, temperature_report, type, invoice_id, cancel, admin_invoice, folio_0, reason, user_remove_id, is_available, created_at, updated_at, deleted_at)
      //Esta tabla es la principal para generar reportes de facturación, esta debe ser la tabla central cuando se pidan reportes de facturación
      //Que su asignación de nombre tipo apodo o alias sea inv_f

      ### invoice_warehouses
      invoice_warehouses (id, name, code, number, email, created_at, updated_at, deleted_at)

      ### other_exit_types
      other_exit_types (id, name, code, created_at, updated_at, deleted_at)

      ### reva_cancelations
      reva_cancelations (id, reva_id, amount, payment_condition_id, credit_account, c_cfdi_type_id, client_id, agent_id, warehouse_id, c_payment_type_id, observations, created_at, updated_at, deleted_at)

      ### revalidations
      revalidations (id, final_master_id, agent_id, warehouse_id, client_id, cfdi_type_id, revalidation_payment_type_id, desconsolidation_payment_type_id, freight_payment_type_id, payment_condition_id, account_payment, observations, due_agent, collect, created_at, updated_at, deleted_at)

      ### users
      users (id, no_emp, job, first_name, last_name, email, password, user_type, birthdate, phone, country_id, state_id, city_id, municipality, colony, street, no_ext, no_int, postal_code, rfc, role_id, area_id, is_main_cashier, is_cashier, last_login, is_supervisor, password_at, user_profiles, pass_incidence, created_at, updated_at, deleted_at)
      user_permissions (id, user_id, menu_module_id, menu_sub_module_id, permission, created_at, updated_at)
      menu_modules (id, name) // Estos son los nombres de los permisos, para que cuando se pidan permisos se usen estos nombres legibles

      ------------------------------------------------------------------------------------------------------------------------
      ------------------------------------------------------------------------------------------------------------------------

      ---- Relaciones ----


      ### invoice_folios

      -   user_id → users.id
      -   client_id → clients.id
      -   final_master_id → final_masters.id
      -   final_house_id → final_houses.id
      -   invoice_id → invoice_exits.id
      -   user_remove_id → users.id

      ### invoice_cores
      -   id_invoice → invoice_folios.id

      ### invoice_exits

      -   final_master_id → final_masters.id
      -   final_house_id → final_houses.id
      -   agent_id → agents.id
      -   invoice_warehouse_id → invoice_warehouses.id
      -   client_id → clients.id
      -   c_payment_condition_id → c_payment_conditions.id
      -   c_cfdi_type_id → c_cfdi_types.id
      -   c_payment_type_id → c_payment_types.id
      -   c_exit_type_id → c_exit_types.id
      -   other_exit_type_id → other_exit_types.id

      ### reva_cancelations

      -   reva_id → revalidations.id
      -   payment_condition_id → c_payment_conditions.id
      -   c_cfdi_type_id → c_cfdi_types.id
      -   client_id → clients.id
      -   agent_id → agents.id
      -   warehouse_id → invoice_warehouses.id
      -   c_payment_type_id → c_payment_types.id

      ### revalidations

      -   final_master_id → final_masters.id
      -   agent_id → agents.id
      -   warehouse_id → invoice_warehouses.id
      -   client_id → clients.id
      -   cfdi_type_id → c_cfdi_types.id
      -   payment_condition_id → c_payment_conditions.id

      ### user_permissions

      -   user_id → users.id
      -   menu_module_id → menu_modules.id
      -   locations_c_cargo_types.location_id -> locations.id
      -   locations_c_cargo_types.cargo_type_id -> c_cargo_types.id
      -   user_permissions.user_id -> users.id
      -   user_permissions.menu_module_id -> menu_modules.id
      `;

      


const { succes, error } = require("../utils/handleResponse");

// src/controllers/chat.js (continuación)

// -------------------------------------------------------------------------
// 1. Lógica Principal: Crear Chat, Generar Query, Ejecutar y Reportar
// -------------------------------------------------------------------------
const createNewChatAndGenerateQuery = async (req, res) => {
  const { user_prompt, id } = req.body;
  const userId = id; // Usar req.user.id con authMiddleware
  if (!user_prompt) {
    return res.status(400).json({ error: 'Falta la solicitud del usuario (user_prompt).' });
  }

  try {
    // 1. INICIAR CHAT y guardar el prompt del usuario
    const chat = await Chat.create({ title: user_prompt.substring(0, 50) + '...', user_id: userId });
    const chatId = chat.id;

    const conv = await Conversation.bulkCreate([
      { chat_id: chatId, role: 'user', content: user_prompt }
    ]);

    // 2. GENERAR QUERY (Text-to-SQL con OpenAI)
    const { generatedQuery, statusQuery, MessageQuery } = await generateQueryFromPrompt(user_prompt, TEMP_DB_SCHEMA);
    console.log("Generated Query:", generatedQuery);
    console.log("Status Query:", statusQuery);
    console.log("Message Query:", MessageQuery);


    // 3. EJECUTAR QUERY y GENERAR REPORTE
    const { reportPath, reportMessage } = await executeQueryAndGenerateReport(generatedQuery, userId, conv[0].id, chatId);
    console.log("Report Path:", reportPath);
    console.log("Report Message:", reportMessage);

    // 4. GUARDAR RESPUESTA DE LA IA en la conversación
    // La IA responde con un mensaje de éxito y el path del reporte
    const assistantResponse = `He ejecutado la consulta SQL con éxito.\n**Query Generada:** \`\`\`sql\n${generatedQuery}\n\`\`\`\n**Mensaje:** ${reportMessage}\nEl reporte ha sido generado y guardado en: ${reportPath}`;

    await Conversation.create({
      chat_id: chatId,
      role: 'assistant',
      content: assistantResponse
    });

    await delay(7000); // Pausa la ejecución por 7000 milisegundos (7 segundos)

    // 5. RESPONDER AL CLIENTE
    res.status(201).json({
      chatId,
      message: assistantResponse,
      response: assistantResponse,
      reportPath: reportPath
    });

  } catch (error) {
    console.error('❌ Error en createNewChatAndGenerateQuery:', error);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud.', detail: error.message });
  }
};


// -------------------------------------------------------------------------
// 2. Obtener Historial de Chats (Sidebar)
// -------------------------------------------------------------------------
const getUserChats = async (req, res) => {
  const userId = req.body.id; // Usar req.user.id con authMiddleware

  try {
    const chats = await Chat.findAll({
      where: { user_id: userId },
      attributes: ['id', 'title', 'user_id', 'createdAt'], // Solo los campos necesarios para la lista
      order: [['updatedAt', 'DESC']]
    });

    res.json(chats);
  } catch (error) {
    console.error('❌ Error al obtener chats:', error);
    res.status(500).json({ error: 'No se pudo cargar el historial de chats.' });
  }
};


// -------------------------------------------------------------------------
// 3. Obtener Conversación Completa
// -------------------------------------------------------------------------
const getConversationByChatId = async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.query;
  if (!chatId || !userId) {
    return res.status(400).json({ error: 'Faltan parámetros: chatId y/o userId.' });
  }

  try {
    const chat = await Chat.findOne({ where: { id: chatId, user_id: userId } });

    if (!chat) {
      return res.status(404).json({ error: 'Chat no encontrado o no pertenece al usuario.' });
    }

    const conversation = await Conversation.findAll({
      where: { chat_id: chatId },
      attributes: ['role', 'content', 'createdAt'],
      order: [['createdAt', 'ASC']]
    });

    res.json({
      chatTitle: chat.title,
      messages: conversation
    });

  } catch (error) {
    console.error('❌ Error al obtener conversación:', error);
    res.status(500).json({ error: 'No se pudo cargar la conversación.' });
  }
};

// -------------------------------------------------------------------------
// 4. Lógica para Continuar la Conversación (Actualizar/Añadir Mensajes)
// -------------------------------------------------------------------------
const continueConversationAndGenerateQuery = async (req, res) => {
  // El frontend debe enviar el ID del chat y el nuevo prompt del usuario
  const { chat_id, user_prompt, userId } = req.body;

  if (!chat_id || !user_prompt) {
    return res.status(400).json({ error: 'Faltan parámetros: chat_id y/o user_prompt.' });
  }

  try {
    // 1. Verificar si el chat existe y pertenece al usuario (Seguridad)
    const chat = await Chat.findOne({ where: { id: chat_id, user_id: userId } });

    if (!chat) {
      return res.status(404).json({ error: 'Chat no encontrado o no autorizado.' });
    }

    // 2. Guardar el nuevo prompt del usuario en la conversación
    const conv = await Conversation.create({ chat_id, role: 'user', content: user_prompt });
console.log("================")
console.log(conv.id)
console.log("================")

    // 3. GENERAR QUERY (Text-to-SQL con OpenAI)
    // La lógica es la misma: generar una query basada en el prompt y el esquema
    const { generatedQuery, statusQuery, MessageQuery } = await generateQueryFromPrompt(user_prompt, TEMP_DB_SCHEMA);
    console.log("Generated Query:", generatedQuery);
    console.log("Status Query:", statusQuery);
    console.log("Message Query:", MessageQuery);

    console.log("================")
    console.log(generatedQuery, userId,  userId, conv.id, chat_id)
    console.log("================")

    // 4. EJECUTAR QUERY y GENERAR REPORTE
    const { reportPath, reportMessage } = await executeQueryAndGenerateReport(generatedQuery,userId, conv.id, chat_id);
    console.log("Report Path:", reportPath);
    console.log("Report Message:", reportMessage);

    // 5. GUARDAR RESPUESTA DE LA IA en la conversación
    const assistantResponse = `He ejecutado la consulta SQL con éxito.\n**Query Generada:** \`\`\`sql\n${generatedQuery}\n\`\`\`\n**Mensaje:** ${reportMessage}\nEl reporte ha sido generado y guardado en: ${reportPath}`;

    await Conversation.create({
      chat_id,
      role: 'assistant',
      content: assistantResponse
    });

    // 6. Actualizar la marca de tiempo del chat (para orden en la sidebar)
    await chat.update({ updatedAt: new Date() });

    await delay(7000);

    // 7. RESPONDER AL CLIENTE
    res.status(200).json({
      chatId: chat_id,
      message: 'Nueva consulta procesada y reporte generado.',
      response: assistantResponse,
      reportPath: reportPath
    });

  } catch (error) {
    console.error('❌ Error en continueConversationAndGenerateQuery:', error);
    res.status(500).json({ error: 'Hubo un error al procesar la solicitud.', detail: error.message });
  }
};

// Función para crear una pausa (delay)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


module.exports = {
  createNewChatAndGenerateQuery,
  getUserChats,
  getConversationByChatId,
  continueConversationAndGenerateQuery,
};
