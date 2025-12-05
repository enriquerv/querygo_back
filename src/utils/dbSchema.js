// dbSchema.js

const DB_SCHEMA = `
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
      users (id, no_emp, job, first_name, last_name, email, password, user_type, birthdate, phone, country_id, state_id, city_id, municipality, colony, street, no_ext, no_int, postal_code, rfc, role_id, area_id, is_main_cashier, is_cashier, last_login, is_supervisor, password_at, user_profiles, pass_incidence, createdAt, updatedAt, deletedAt)
      
      ### user_permissions
      user_permissions (id, user_id, menu_module_id, menu_sub_module_id, permission, createdAt, updatedAt)
      
      ### profiles
        user_permissions (id, name, created_at, updated_at, deleted_at) 
        ** Tabla que se utiliza para nombrar que perfil se le asigna a los usuarios en la tabla users, el campo que las relaciona es user_profiles

      ### menu_modules
      menu_modules (id, name) // Estos son los nombres de los permisos, para que cuando se pidan permisos se usen estos nombres legibles

      ------------------------------------------------------------------------------------------------------------------------
      ------------------------------------------------------------------------------------------------------------------------

      ---- Relaciones ----

      ### users
      -   user_profiles → profiles.id

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

module.exports = {
    DB_SCHEMA
};