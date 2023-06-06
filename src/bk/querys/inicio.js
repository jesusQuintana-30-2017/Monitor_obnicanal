module.exports.consultarPreferencias = `SELECT mntrprefid id, mntrprefind dsc from bdnrh.mntrpref where mntrprefid = ?`

module.exports.consultarAgentes = `SELECT 'I' area, btAgenteInbId id,btAgenteInbNombre nom,btAgenteInbExt ext, btagenteInbtStsExt sts, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteinbhorallam,now())), '00:00:00') 
WHEN BTESTAGNTT = 'RES' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,BTESTAGNTSALRECESO,now())), '00:00:00') ELSE '00:00:00' END duracion, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN ifnull(btagenteIdLlamada,'') ELSE '' END idllamada,  ifnull(btagenteinbinicio, '00:00:00') inicio, 
ifnull(B.BTESTAGNTT, 'DIS') stsrec,'00:00:00' duracionreceso,'' permiso, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN btagenteNumeroCli ELSE '' END Telefono, 
CASE WHEN btagenteInbtStsExt = 'DISPONIBLE' OR 'TIMBRANDO' THEN '0' ELSE ifnull(TIME_TO_SEC(TIMESTAMPDIFF(second,btagenteinbhorallam,now())), '0') END duracionseg,    
ifnull(btagenteCola,'300') skill,btagenteServidorip Servidor, CASE WHEN ifnull(B.BTESTAGNTT, 'DIS') = 'DIS' THEN '' ELSE BTESTAGNTMOTIVO END permiso, '' src, 
DATE_FORMAT(now(), '%d/%m/%Y') fecha, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteinbhorallam, '%H:%i:%s') 
WHEN BTESTAGNTT = 'RES' THEN DATE_FORMAT(BTESTAGNTSALRECESO, '%H:%i:%s') ELSE '00:00:00' END hora, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN TIME_TO_SEC(DATE_FORMAT(NOW(), '%H:%i:%s')) - TIME_TO_SEC(DATE_FORMAT(btagenteinbhorallam, '%H:%i:%s')) ELSE '0' END segundos, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN ifnull(btagenteNombreCli,'') ELSE '' END nombreCliente, marcador, C.btsupervisonoml supervisor
FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR 
LEFT JOIN bstntrn.btsupervisor C on A.btagenteIdSupervis=C.btsupervisoidn
where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S' 
and (btagenteIdSupervis = ? or ? = '') AND btagenteInbtStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?) 
and btAgenteInbId like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%') AND btagenteinboundactivo = 1`;

module.exports.consultarAgentesOut = `SELECT 'O' area, btAgenteOutId id,btAgenteOutNombre nom,btAgenteCmpId cmp,btAgenteOutExt ext,btagenteOutStsExt sts,
ifnull(z.BTESTAGNTT, 'DIS') stsrec, 
ifnull(date_format(TIMEDIFF(now(),BTESTAGNTSALRECESO),'%H:%i:%s'),'00:00:00') duracionreceso, btagenteOutTelefonoCliente Telefono,BTESTAGNTPERMISOID permisoid,BTESTAGNTMOTIVO permiso, 
DATE_FORMAT(now(), '%d/%m/%Y') fecha, CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteouthorallam,now())), '00:00:00') 
WHEN BTESTAGNTT = 'RES' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,BTESTAGNTSALRECESO,now())), '00:00:00') ELSE '00:00:00' END duracion, 
CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteouthorallam, '%H:%i:%s') 
WHEN BTESTAGNTT = 'RES' THEN DATE_FORMAT(BTESTAGNTSALRECESO, '%H:%i:%s') ELSE '00:00:00' END hora, CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(C.btContactoNombreCliente,'') else '' END nombreCliente,
CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(z.BTESTAGNTCALLID,'') else '' END idllamada, marcador 
FROM siogen01.cnuser a 
inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn 
inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN 
inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId 
left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId 
LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR 
LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid) 
WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND aout.btAgenteCmpId like concat('%',?,'%') AND (b.btsupervisoidn = ? or ? = '') AND btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?)
and btAgenteOutId  like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%')  AND cmp.bstnCanalId <> 'CALL' AND btagenteoutboundactivo = 1 order by field(sts, 'En LLAMADA', 'DISPONIBLE', 'RECESO', 'NO CONECTADO', 'NO DISPONIBLE'), duracion desc`;

module.exports.consultarAgentesAll = `SELECT 'I' area, btAgenteInbId id,btAgenteInbNombre nom,btAgenteInbExt ext, btagenteInbtStsExt sts, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteinbhorallam,now())), '00:00:00') 
WHEN btagenteInbtStsExt = 'RECESO' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,BTESTAGNTSALRECESO,now())), '00:00:00') ELSE '00:00:00' END duracion, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN ifnull(btagenteIdLlamada,'') ELSE '' END idllamada,  ifnull(btagenteinbinicio, '00:00:00') inicio, 
ifnull(B.BTESTAGNTT, 'DIS') stsrec,'00:00:00' duracionreceso,'' permiso, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN btagenteNumeroCli ELSE '' END Telefono, 
CASE WHEN btagenteInbtStsExt = 'DISPONIBLE' OR 'TIMBRANDO' THEN '0' ELSE ifnull(TIME_TO_SEC(TIMESTAMPDIFF(second,btagenteinbhorallam,now())), '0') END duracionseg,    
ifnull(btagenteCola,'300') skill,btagenteServidorip Servidor, CASE WHEN ifnull(B.BTESTAGNTT, 'DIS') = 'DIS' THEN '' ELSE BTESTAGNTMOTIVO END permiso, '' src, 
DATE_FORMAT(now(), '%d/%m/%Y') fecha, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteinbhorallam, '%H:%i:%s') 
WHEN btagenteInbtStsExt = 'RECESO' THEN DATE_FORMAT(BTESTAGNTSALRECESO, '%H:%i:%s') ELSE '00:00:00' END hora, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN TIME_TO_SEC(DATE_FORMAT(NOW(), '%h:%i:%s')) - TIME_TO_SEC(DATE_FORMAT(btagenteinbhorallam, '%h:%i:%s')) ELSE '0' END segundos, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN ifnull(btagenteNombreCli,'') ELSE '' END nombreCliente, marcador, C.btsupervisonoml supervisor
FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR 
LEFT JOIN bstntrn.btsupervisor C on A.btagenteIdSupervis=C.btsupervisoidn
where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S'
and btagenteIdSupervis like concat('%',?,'%') AND btagenteInbtStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?) 
and btAgenteInbId like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%')`;

module.exports.consultarAgentesOutAll = " SELECT 'O' area, btAgenteOutId id,btAgenteOutNombre nom,btAgenteCmpId cmp,btAgenteOutExt ext,btagenteOutStsExt sts," +
    " ifnull(z.BTESTAGNTT, 'DIS') stsrec, " +
    " ifnull(date_format(TIMEDIFF(now(),BTESTAGNTSALRECESO),'%H:%i:%s'),'00:00:00') duracionreceso, btagenteOutTelefonoCliente Telefono,BTESTAGNTPERMISOID permisoid,BTESTAGNTPERMISO permiso, " +
    " DATE_FORMAT(now(), '%d/%m/%Y') fecha, CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteouthorallam, '%H:%i:%s') ELSE '00:00:00' END hora, " +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteouthorallam,now())), '00:00:00') ELSE '00:00:00' END duracion," +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(C.btContactoNombreCliente,'') else '' END nombreCliente," +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(z.BTESTAGNTCALLID,'') else '' END idllamada, marcador " +
    " FROM siogen01.cnuser a " +
    " inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn " +
    " inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN " +
    " inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId " +
    " left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId " +
    " LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR " +
    " LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid) " +
    " WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND aout.btAgenteCmpId like concat('%',?,'%') AND b.btsupervisoidn like concat('%',?,'%') "+
     " AND btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?)"+
     " and btAgenteOutId like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%') order by field(sts, 'En LLAMADA', 'DISPONIBLE', 'RECESO', 'NO CONECTADO', 'NO DISPONIBLE'), duracion desc ";

     module.exports.consultarAgentesAllME = `select  canales.NRHEMUSERID agente ,  agt.NRHEMDBNOMCOM nombre_agente 
     from bdnrh.nrhemdbmc canales   
     inner join bdnrh.nrhemdbmcinteracciones interacciones   
     on canales.NRHEMDBIDG = interacciones.NRHEMDBIDG  
     left join bstntrn.btestagnt est on (est.BTESTAGNTUSR=canales.NRHEMUSERID)  
     left join bdnrh.nrhemdb agt on (canales.NRHEMUSERID=agt.NRHEMUSERID)
     where  
     bstnCanalIDN in (11,12,7,8)
     and est.BTESTAGNTT!='SOLAUT' and  est.BTESTAGNTT!='RES'  
     and (nrhemdbmcinteraccioneslestatus = 1 or nrhemdbmcinteraccioneslestatus = 2 ) 
      and canales.NRHEMUSERID = ?
      `;


module.exports.getAllCampanas = "SELECT '' ID, 'Todas' DSC UNION SELECT btcampanas.btcampanaid ID,Concat(btcampanas.btcampanaid,'-',btcampanadescripcion) DSC " +
"FROM bstntrn.btcampanas " +
"LEFT JOIN bstntrn.btsupervisordet as a on a.btcampanaid=btcampanas.btcampanaid " +
"LEFT JOIN bstntrn.btsupervisor on a.btsupervisoidn=btsupervisor.btsupervisoidn " +
"WHERE btsupervisor.btsupervisonomp like concat ('%',?,'%')";

module.exports.allCampanas = "SELECT '' ID, 'Todas' DSC, 0 UNI UNION SELECT btcampanaid ID,Concat(btcampanaid,'-',btcampanadescripcion) DSC,btcampanauniverso UNI FROM bstntrn.btcampanas order by ID"

//ConsultaSupervisores
module.exports.consultarSupervisores = "SELECT btsupervisoidn ID, btsupervisonoml DSC FROM bstntrn.btsupervisor a inner join bdnrh.nrhemdb b on b.NRHEMUSERID = a.btsupervisonomp where btsupervisonomp = ?  and b.NRHEM05ID='0001' ";
module.exports.consultarSupervisoresOut = "SELECT btsupervisoidn ID, btsupervisonoml DSC FROM bstntrn.btsupervisor a inner join bdnrh.nrhemdb b on b.NRHEMUSERID = a.btsupervisonomp where btsupervisonomp = ? and b.NRHEM05ID='0001' ";
module.exports.consultarSupervisoresAll = "SELECT '' ID, 'Todos' DSC FROM bstntrn.btsupervisor union SELECT btsupervisoidn ID, btsupervisonoml DSC FROM bstntrn.btsupervisor a inner join bdnrh.nrhemdb b on b.NRHEMUSERID = a.btsupervisonomp where b.NRHEM05ID='0001' "

module.exports.getAllEstatus = `SELECT btestatusmonitorId ID, btestatusmonitorDsc DSC FROM bstntrn.btestatusmonitor WHERE btestatusmonitorIdn <> 5 AND btestatusmonitorIdn <> 6 AND btestatusmonitorIdn <> 7`;

module.exports.getEstatusRes = "SELECT btestatusmonitorId ID, btestatusmonitorDsc DSC FROM bstntrn.btestatusmonitor WHERE btestatusmonitorId = 'ALL'" +
    "UNION SELECT btestatusmonitorId ID, btestatusmonitorDsc DSC FROM bstntrn.btestatusmonitor WHERE btestatusmonitorDsc LIKE concat('%','receso','%')";

module.exports.getAllColas = "SELECT btcolaesperaid ID, btcolaesperadsc DSC FROM bstntrn.btcolaespera where btcolaesperamostrar = 'PROD'";

module.exports.getAllColasP = "SELECT btcolaesperaid ID, btcolaesperadsc DSC FROM bstntrn.btcolaespera";

module.exports.getSupervisor = "SELECT btsupervisoidn ID, btsupervisonoml DSC FROM bstntrn.btsupervisor  where btsupervisonomp = ?"

module.exports.getAllSupervisores = "SELECT btsupervisoidn ID, btsupervisonoml DSC FROM bstntrn.btsupervisor"

//Indicadores
module.exports.conIndicadores = `SELECT btagenteInbtStsExt estatus,sum(IF (btagenteInbtStsExt = 'DISPONIBLE',1,0) ) Disponible,SUM(IF (btagenteInbtStsExt = 'EN LLAMADA',1,0) )llamada,  
sum(IF (btagenteInbtStsExt = 'DISPONIBLE',1,0) + (IF (btagenteInbtStsExt = 'EN LLAMADA',1,0))) Operacion,  
SUM(IF (BTESTAGNTT = 'SOLAUT',1,0)) solAut, SUM(IF (BTESTAGNTT = 'SOL',1,0)) Sol, SUM(IF (BTESTAGNTT = 'RES',1,0)) Res,  
a.btAgenteInbId, a.btAgenteInbNombre
FROM bstntrn.btagenteinbound a inner join bstntrn.btestagnt on a.btAgenteInbId=bstntrn.btestagnt.BTESTAGNTUSR
where btAgenteCmpId like concat('%',?,'%') AND btagenteCola like concat('%',?,'%') and btAgenteInbSesion = 'S' 
and btagenteIdSupervis=? AND btagenteInbtStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?)
and a.btAgenteInbId like concat('%',?,'%') and a.btAgenteInbNombre like concat('%',?,'%') `;

module.exports.conIndicadoresAll = "SELECT btagenteInbtStsExt estatus,sum(IF (btagenteInbtStsExt = 'DISPONIBLE',1,0) ) Disponible,SUM(IF (btagenteInbtStsExt = 'EN LLAMADA',1,0) )llamada, " +
    " sum(IF (btagenteInbtStsExt = 'DISPONIBLE',1,0)  + (IF (btagenteInbtStsExt = 'EN LLAMADA',1,0))) Operacion, " +
    " SUM(IF (BTESTAGNTT = 'SOLAUT',1,0)) solAut, SUM(IF (BTESTAGNTT = 'SOL',1,0)) Sol, SUM(IF (BTESTAGNTT = 'RES',1,0)) Res " +
    " FROM bstntrn.btagenteinbound inner join bstntrn.btestagnt on btagenteinbound.btAgenteInbId=bstntrn.btestagnt.BTESTAGNTUSR " +
    " where btAgenteCmpId like concat('%',?,'%') AND btagenteCola like concat('%',?,'%') and btAgenteInbSesion = 'S'" +
    " and btagenteIdSupervis like concat('%',?,'%') AND btagenteInbtStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?)"+
    " and btAgenteInbId like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%')"


//Indicadores de llamada
module.exports.getConsultarMetricas = "SELECT btmetcontestadas contestadas,btmetabandonadas abandonadas,btmetrecibidas recibidas,btmetespera enespera,btmetivr enivr FROM bstntrn.btmetricas where btmetricasid = 1000;";
module.exports.ActualizarIvr = "update bstntrn.btmetricas set btmetrecibidas = btmetcontestadas+btmetabandonadas, btmetivr = ? where btmetricasid = 1000;";
module.exports.ActualizarEspera = "update bstntrn.btmetricas set btmetrecibidas = btmetcontestadas+btmetabandonadas,btmetespera = ? where btmetricasid = 1000;";

//Busca si el agente solicitó receso
module.exports.agenteReceso = "SELECT * FROM bstntrn.btestagnt WHERE BTESTAGNTT = 'SOL' AND BTESTAGNTUSR=?";
//Autorizar Receso
module.exports.autorizaReceso = " UPDATE BSTNTRN.BTESTAGNT SET BTESTAGNTT='SOLAUT' WHERE BTESTAGNTUSR=?";
//Rechazar Receso
module.exports.rechazarReceso = " UPDATE BSTNTRN.BTESTAGNT SET BTESTAGNTT='DIS' WHERE BTESTAGNTUSR=?";

//Cerrar sesion agente
module.exports.cerrarSesionAgt = "UPDATE bstntrn.btagenteinbound SET btagenteInbtStsExt = 'NO DISPONIBLE', btAgenteInbSesion = 'N' WHERE btAgenteInbId  = ? ";

module.exports.cerrarSesionAgtOut = "UPDATE bstntrn.btagenteoutbound SET btagenteOutStsExt = 'NO DISPONIBLE', btAgenteOutSesion = 'N' WHERE btAgenteOutId  = ? ";

module.exports.cerrarSesionAgtMe = "UPDATE bdnrh.nrhemdbmcinteracciones  SET nrhemdbmcinteraccioneslestatus = ?  WHERE NRHEMUSERID  = ? ";


module.exports.cerrarSesionAgtMeF1 = `UPDATE spcfacebook.spcfbagentepage SET spcfbagentepageAtn=0
where spcfbidAgente=?;
`;
 
module.exports.cerrarSesionAgtMeF3 = `update  inmc.imc im
inner join spcfacebook.spcfbcontactos con on ( spcfbtcontactosnumero =imcclienteid )  
set spcfbcontactosEncola = '0'  
where imcagente=? and inmccanalid='F'
and inmcestid=1 ;`;

module.exports.cerrarSesionAgtMeF4 = `UPDATE inmc.imc  
set inmcestid ='4'      ,imcagente='NA'  ,imcfinmonitor=now()
 where imcagente=? and inmccanalid='F'
and inmcestid=1 
`;




module.exports.cerrarSesionAgtMeT1 = `UPDATE spctwitter.spctwagentepage SET spctwagentepageAtn=0
where spctwidAgente=?`;
 
module.exports.cerrarSesionAgtMeT3 = `update  inmc.imc im
inner join spctwitter.spctwcontactos con on ( spctwtcontactosnumero =imcclienteid )  
set spctwcontactosEncola = '0'  
where imcagente=? and inmccanalid='T'
and inmcestid=1  `;
module.exports.cerrarSesionAgtMeT4 = `UPDATE inmc.imc im
set inmcestid ='4'      ,imcagente='NA' ,  imcfinmonitor=now() 
 where imcagente=? and inmccanalid='T'
and inmcestid=1 ;
 `;


module.exports.cerrarSesionAgtMeCH1 = `update inmc.imc im
inner join siogen01.PRTCHCL cl on (PRTCHCLID=imcsesionid )
set  PRTCHCLEST = 1
where imcagente=? and inmccanalid='CH'
and inmcestid=1 `;
module.exports.cerrarSesionAgtMeCH2 = ` UPDATE inmc.imc SET inmcestid ='4' , imcagente='NA' ,imcsesionid='', imcfinmonitor=now()
where imcagente=? and inmccanalid='CH'
and inmcestid=1 `;



module.exports.CerrarSesionAg = "DELETE FROM bstntrn.monac WHERE monacID=?"


module.exports.updateMovimientosUsuario = " UPDATE  bstntrn.btmpersonal " +
    " SET btmpersonalDURS= FLOOR(TIME_TO_SEC(TIMEDIFF(?, BTMPERSONALHINI))), btmpersonalFFIN = ? ,btmpersonalHFIN= ?,btmpersonalDUR = SUBSTR(TIMEDIFF(?, BTMPERSONALHINI),1,8) " +
    " WHERE SIOUSUARIOID= ?  and btmpersonalRECID= ? AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL ";

module.exports.updateReceso = `UPDATE  bstntrn.btmpersonal 
SET BTMPERSONALDURS= FLOOR(TIMEDIFF(?,CONCAT(BTMPERSONALFINI, ' ', BTMPERSONALHINI))), BTMPERSONALFFIN = ? ,BTMPERSONALHFIN= ?,BTMPERSONALDUR = SUBSTR(TIMEDIFF(?,CONCAT(BTMPERSONALFINI, ' ', BTMPERSONALHINI)),1,8) 
WHERE SIOUSUARIOID= ?  and btmpersonalRECID= ? AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL ;`

module.exports.calcularIdmonacH = "SELECT ifnull(MAX(monacHID)+1,1) AS id FROM bstntrn.monach ";



module.exports.InsertarSesionTrabajoHistorial = "INSERT INTO bstntrn.monach" +
    "   (monacHID,monacID," +
    "  monacAP," +
    "   monacF," +
    "  monacH," +
    "  monacUA," +
    "  monacIP," +
    "  monacEST," +
    "  monacOD," +
    "  monacIDEQUIPO," +
    "  monacRAN)" +
    "  VALUES" +
    " ((SELECT ifnull(MAX(monacHID)+1,1) AS id FROM bstntrn.monach id),?,'Agente',?,?,'Programa del agente',?,?,'',?,'0')";




//configurar video
module.exports.getAgenteVideo = "SELECT * FROM bstntrn.bstnstatusllamada where userid = ?";

//insertar configuracion
module.exports.newConfiguracion = "INSERT INTO bstntrn.bstnstatusllamada (extension,estatusLlamada,configuraGrabacion,valor,userid) VALUES (?,?,?,?,?)";

//configuracion numLlamadas
module.exports.configuracionNumLlamadas = "UPDATE bstntrn.bstnstatusllamada SET configuraGrabacion =?, valor = ?,conteLlamada = 0, contador=0, fechaHoraFinal = now() WHERE  userid = ?"
    //configuracion numTiempo
module.exports.configuracionNumTiempo = "UPDATE bstntrn.bstnstatusllamada SET configuraGrabacion = ?, valor = ?,fechaHoraFinal = DATE_ADD(now(), interval '0' ? DAY_SECOND) WHERE  userid = ?"
    //configuracion numDias
module.exports.configuracionNumDias = "UPDATE bstntrn.bstnstatusllamada SET configuraGrabacion = ?, valor = ?, fechaHoraFinal = DATE_ADD(now(), interval ? DAY) WHERE  userid = ?"
    //configuracion siempre o no guardar
module.exports.configuracionVideo = "UPDATE bstntrn.bstnstatusllamada SET configuraGrabacion = ?, valor = 0 WHERE  userid = ?"
    //universo
module.exports.universo = "SELECT count(*) universo FROM bstntrn.btcontacto a inner join bstntrn.btcampanas b on a.btContactoCmpId=b.btcampanaid where btcontactocmpid like concat('%',?,'%') AND b.bstnCanalId <> 'CALL'";
//  realizadas
module.exports.realizadas = "SELECT COUNT(*) realizadas FROM asteriskcdrdb.cdr a where (calldate>?  and  ?<'23:59:59') and recordingfile like '%out%'  and disposition = 'ANSWERED' " +
    " and lastapp =  'dial' and accountcode like concat(?,'%') ";
// exitosas
module.exports.exitosas = "select count(*) exitosas from bstntrn.btcontactotip a inner join bstntrn.btcampanas b on a.btcontactotipcamp=b.btcampanaid where btcontactotip1 = '1' and btcontactotipfecha >= ? and btcontactotipcamp like concat('%',?,'%') AND b.bstnCanalId <> 'CALL'";
// no exitosas
module.exports.noExitosas = "select count(*) noExitosas from bstntrn.btcontactotip a inner join bstntrn.btcampanas b on a.btcontactotipcamp=b.btcampanaid where btcontactotip1 = '2' and btcontactotipfecha >= ? and btcontactotipcamp like concat('%',?,'%') AND b.bstnCanalId <> 'CALL'";
// rellamar 
module.exports.rellamar = "select count(*) reLlamar from bstntrn.btcontactotip a inner join bstntrn.btcampanas b on a.btcontactotipcamp=b.btcampanaid where btcontactotipfecha >= ? and btcontactotip1 = '3' and btcontactotipcamp like concat('%',?,'%') AND b.bstnCanalId <> 'CALL' ";
// pendientes
module.exports.pendientes = "SELECT COUNT(*) pendientes FROM bstntrn.btcontacto a inner join bstntrn.btcampanas b on a.btContactoCmpId=b.btcampanaid where btContactoSts = 'PENDIENTE' AND btContactoCmpId = ? AND b.bstnCanalId <> 'CALL'";

module.exports.coordinadores = "SELECT * FROM bdnrh.nrhemdb where (NRHEMBDCLASEUSER=9 OR NRHEMBDCLASEUSER=10) and NRHEMUSERID = ?";

module.exports.consultarIdnAgnts = "SELECT canal, idagente, nombreagente, ext, llamatendidas, SEC_TO_TIME(ROUND(duracion)) duracion, conexion, recesos, tiemporeceso, SEC_TO_TIME(ROUND(AHT)) AHT, horaejecucion FROM bstntrn.bstnidnagnts";

module.exports.consultarFecha = "SELECT date_format(fecha, '%Y-%m-%d') fecha FROM bstntrn.bstnidnagntshist group by fecha order by fecha desc limit 1";

module.exports.ahtI = "SELECT canal, SEC_TO_TIME(ifnull(round(SUM(duracion)/sum(llamatendidas)),0)) AHT, marcador FROM bstntrn.bstnidnagnts where canal = 'I' and marcador like concat('%',?,'%')";

module.exports.ahtO = "SELECT canal, SEC_TO_TIME(ifnull(round(SUM(duracion)/sum(llamatendidas)),0)) AHT, marcador FROM bstntrn.bstnidnagnts where canal = 'O' and marcador like concat('%',?,'%')";

module.exports.agntsrs = "SELECT inmccanalid area, imcagente id, a.CNUSERDSC nom, b.inmcestdsc sts, '' cmp,'' ext, "+
" ifnull(date_format(TIMEDIFF(now(),BTESTAGNTSALRECESO),'%H:%i:%s'),'00:00:00') duracionreceso, "+
" ifnull(z.BTESTAGNTT, 'DIS') stsrec, BTESTAGNTPERMISOID permisoid,BTESTAGNTPERMISO permiso, "+
" ifnull(date_format(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(imcfechainiatn, ' ' , imchorainiatn),now())),'%H:%i:%s'), '00:00:00') duracion, ifnull(imctelefono, '') Telefono, "+
" DATE_FORMAT(imcfechainiatn, '%d/%m/%Y') fecha, ifnull(DATE_FORMAT(imchorainiatn, '%H:%i:%s'), '00:00:00') hora, "+
" DATE_FORMAT(imcfechaasiga, '%d/%m/%Y') fechaAsignacion, ifnull(DATE_FORMAT(imchoraasiga, '%H:%i:%s'), '00:00:00') horaAsignacion, "+
" ifnull(imccliente,'') nombreCliente, '' idllamada, agt.imcsesionid Sesion "+
" FROM siogen01.cnuser a inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn"+
" inner join inmc.imc agt on a.cnuserid = agt.imcagente "+
" inner join inmc.inmce b on agt.inmcestid = b.inmcestid "+
" LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR where C.btsupervisoidn=? AND b.inmcestid = 1"+
" AND imcagente like concat('%',?,'%') and a.CNUSERDSC like concat('%',?,'%')";

module.exports.agntsrsAll = "SELECT inmccanalid area, imcagente id, a.CNUSERDSC nom, b.inmcestdsc sts, '' cmp,'' ext, "+
" ifnull(date_format(TIMEDIFF(now(),BTESTAGNTSALRECESO),'%H:%i:%s'),'00:00:00') duracionreceso, "+
" ifnull(z.BTESTAGNTT, 'DIS') stsrec, BTESTAGNTPERMISOID permisoid,BTESTAGNTPERMISO permiso, "+
" ifnull(date_format(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(imcfechainiatn, ' ' , imchorainiatn),now())),'%H:%i:%s'), '00:00:00') duracion, ifnull(imctelefono, '') Telefono, "+
" DATE_FORMAT(imcfechainiatn, '%d/%m/%Y') fecha, ifnull(DATE_FORMAT(imchorainiatn, '%H:%i:%s'), '00:00:00') hora, "+
" DATE_FORMAT(imcfechaasiga, '%d/%m/%Y') fechaAsignacion, ifnull(DATE_FORMAT(imchoraasiga, '%H:%i:%s'), '00:00:00') horaAsignacion, "+
" ifnull(imccliente,'') nombreCliente, '' idllamada, agt.imcsesionid Sesion "+
" FROM siogen01.cnuser a inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn"+
" inner join inmc.imc agt on a.cnuserid = agt.imcagente "+
" inner join inmc.inmce b on agt.inmcestid = b.inmcestid "+
" LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR where C.btsupervisoidn like concat('%',?,'%') AND b.inmcestid = 1"+
" AND imcagente like concat('%',?,'%') and a.CNUSERDSC like concat('%',?,'%')";

module.exports.totalesmc = `SELECT CANAL, TOTAL FROM (SELECT IFNULL(inmccanalid,'F') CANAL, COUNT(*) TOTAL FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR 
WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'F' AND imcfecha = date_format(now(), '%Y-%m-%d') UNION SELECT IFNULL(inmccanalid,'T') CANAL, COUNT(*) TOTAL FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR 
 WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'T' AND imcfecha = date_format(now(), '%Y-%m-%d') UNION 
 SELECT IFNULL(inmccanalid,'W') CANAL, COUNT(*) TOTAL FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR 
 WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'W' AND imcfecha = date_format(now(), '%Y-%m-%d') UNION SELECT IFNULL(inmccanalid,'M') CANAL, COUNT(*) TOTAL FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR 
 WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'M' AND imcfecha = date_format(now(), '%Y-%m-%d') UNION 
 SELECT IFNULL(inmccanalid,'CH') CANAL, COUNT(*) TOTAL FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR 
 WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'CH' AND imcfecha = date_format(now(), '%Y-%m-%d') UNION SELECT ifnull(inmccanalid, 'SMS') CANAL, COUNT(*) TOTAL FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR 
 WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'SMS' AND imcfecha = date_format(now(), '%Y-%m-%d')) A`;

module.exports.Enespmc = `SELECT IFNULL(inmccanalid, 'F') CANAL, COUNT(*) EN_ESP FROM inmc.imc agt WHERE inmccanalid = 'F' AND agt.inmcestid = 0  
UNION SELECT IFNULL(inmccanalid, 'T') CANAL, COUNT(*) EN_ESP FROM inmc.imc agt WHERE inmccanalid = 'T' AND agt.inmcestid = 0  
UNION SELECT IFNULL(inmccanalid, 'W') CANAL, COUNT(*) EN_ESP FROM inmc.imc agt WHERE inmccanalid = 'W' AND agt.inmcestid = 0  
UNION SELECT IFNULL(inmccanalid, 'M') CANAL, COUNT(*) EN_ESP FROM inmc.imc agt WHERE inmccanalid = 'M' AND agt.inmcestid = 0  
UNION SELECT IFNULL(inmccanalid, 'CH') CANAL, COUNT(*) EN_ESP FROM inmc.imc agt WHERE inmccanalid = 'CH' AND agt.inmcestid = 0  
UNION SELECT IFNULL(inmccanalid, 'SMS') CANAL, COUNT(*) EN_ESP FROM inmc.imc agt WHERE inmccanalid = 'SMS' AND agt.inmcestid = 0`

module.exports.Enatnmc = "SELECT IFNULL(inmccanalid, 'F') CANAL, COUNT(*) EN_ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'F' AND agt.inmcestid = 1 UNION SELECT IFNULL(inmccanalid, 'T') CANAL, COUNT(*) EN_ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'T' AND agt.inmcestid = 1 UNION "+
"SELECT IFNULL(inmccanalid, 'W') CANAL, COUNT(*) EN_ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'W' AND agt.inmcestid = 1 UNION SELECT IFNULL(inmccanalid, 'M') CANAL, COUNT(*) EN_ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'M' AND agt.inmcestid = 1 UNION "+
" SELECT IFNULL(inmccanalid, 'CH') CANAL, COUNT(*) EN_ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'CH' AND agt.inmcestid = 1 UNION SELECT IFNULL(inmccanalid, 'SMS') CANAL, COUNT(*) EN_ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'CH' AND agt.inmcestid = 1"

module.exports.Atnmc = "SELECT IFNULL(inmccanalid, 'F') CANAL, COUNT(*) ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'F' AND agt.inmcestid = 2 AND imcfechfinatn = date_format(now(), '%Y-%m-%d') UNION SELECT IFNULL(inmccanalid, 'T') CANAL, COUNT(*) ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'T' AND agt.inmcestid = 2 AND imcfechfinatn = date_format(now(), '%Y-%m-%d') UNION "+
"SELECT IFNULL(inmccanalid, 'W') CANAL, COUNT(*) ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'W' AND agt.inmcestid = 2 AND imcfechfinatn = date_format(now(), '%Y-%m-%d') UNION SELECT IFNULL(inmccanalid, 'M') CANAL, COUNT(*) ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'M' AND agt.inmcestid = 2 AND imcfechfinatn = date_format(now(), '%Y-%m-%d') UNION "+
" SELECT IFNULL(inmccanalid, 'CH') CANAL, COUNT(*) ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'CH' AND agt.inmcestid = 2 AND imcfechfinatn = date_format(now(), '%Y-%m-%d') UNION SELECT IFNULL(inmccanalid, 'SMS') CANAL, COUNT(*) ATN FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'CH' AND agt.inmcestid = 2 AND imcfechfinatn = date_format(now(), '%Y-%m-%d')"

module.exports.Abnmc = `SELECT IFNULL(inmccanalid, 'F') CANAL, COUNT(*) ABN FROM inmc.imc agt WHERE inmccanalid = 'F' AND agt.inmcestid = 3 AND imcfechfinatn = date_format(now(), '%Y-%m-%d') 
UNION SELECT IFNULL(inmccanalid, 'T') CANAL, COUNT(*) ABN FROM inmc.imc agt WHERE inmccanalid = 'T' AND agt.inmcestid = 3 AND imcfechfinatn = date_format(now(), '%Y-%m-%d') 
UNION SELECT IFNULL(inmccanalid, 'W') CANAL, COUNT(*) ABN FROM inmc.imc agt WHERE inmccanalid = 'W' AND agt.inmcestid = 3 AND imcfechfinatn = date_format(now(), '%Y-%m-%d') 
UNION SELECT IFNULL(inmccanalid, 'M') CANAL, COUNT(*) ABN FROM inmc.imc agt WHERE inmccanalid = 'M' AND agt.inmcestid = 3 AND imcfechfinatn = date_format(now(), '%Y-%m-%d') 
UNION SELECT IFNULL(inmccanalid, 'CH') CANAL, COUNT(*) ABN FROM inmc.imc agt WHERE inmccanalid = 'CH' AND agt.inmcestid = 3 AND imcfechfinatn = date_format(now(), '%Y-%m-%d') 
UNION SELECT IFNULL(inmccanalid, 'SMS') CANAL, COUNT(*) ABN FROM inmc.imc agt WHERE inmccanalid = 'CH' AND agt.inmcestid = 3 AND imcfechfinatn = date_format(now(), '%Y-%m-%d')`

module.exports.Reanmc = "SELECT IFNULL(inmccanalid, 'F') CANAL, COUNT(*) REA FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'F' AND agt.inmcestid = 4 UNION SELECT IFNULL(inmccanalid, 'T') CANAL, COUNT(*) REA FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'T' AND agt.inmcestid = 4 UNION "+
"SELECT IFNULL(inmccanalid, 'W') CANAL, COUNT(*) REA FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'W' AND agt.inmcestid = 4 UNION SELECT IFNULL(inmccanalid, 'M') CANAL, COUNT(*) REA FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'M' AND agt.inmcestid = 4 UNION "+
" SELECT IFNULL(inmccanalid, 'CH') CANAL, COUNT(*) REA FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'CH' AND agt.inmcestid =4  UNION SELECT IFNULL(inmccanalid, 'SMS') CANAL, COUNT(*) REA FROM siogen01.cnuser a inner join inmc.imc agt on a.cnuserid = agt.imcagente inner join bstntrn.btsupervisor C on a.cnusersupervisor = C.btsupervisoidn inner join inmc.inmce b on agt.inmcestid = b.inmcestid LEFT JOIN bstntrn.btestagnt z ON agt.inmcestid = z.BTESTAGNTUSR "+
" WHERE C.btsupervisoidn LIKE CONCAT('%',?,'%') AND inmccanalid = 'CH' AND agt.inmcestid =4 ";

// CALLBACK UNIVERSO
module.exports.cbuniverso = "SELECT count(*) universo FROM bstntrn.btcontacto a inner join bstntrn.btcampanas b on a.btContactoCmpId=b.btcampanaid where b.bstnCanalId = 'CALL';";

// CALLBACK EXITOSAS
module.exports.cbexitosas = "select count(*) exitosas from bstntrn.btcontactotip a inner join bstntrn.btcampanas b on a.btcontactotipcamp=b.btcampanaid where b.bstnCanalId = 'CALL' AND btcontactotip1 = '1' and btcontactotipfecha >= ?;";

// CALLBACK NO EXITOSAS 
module.exports.cbnoexitosas = "select count(*) Noexitosas from bstntrn.btcontactotip a inner join bstntrn.btcampanas b on a.btcontactotipcamp=b.btcampanaid where b.bstnCanalId = 'CALL' AND btcontactotip1 = '2' and btcontactotipfecha >= ?;";

// CALLBACK RELLAMAR
module.exports.cbrellamar = "select count(*) rellamar from bstntrn.btcontactotip a inner join bstntrn.btcampanas b on a.btcontactotipcamp=b.btcampanaid where b.bstnCanalId = 'CALL' AND btcontactotip1 = '3' and btcontactotipfecha >= ?;";

// CALLBACK PENDIENTES 
module.exports.cbpendientes = "SELECT COUNT(*) pendientes FROM bstntrn.btcontacto a inner join bstntrn.btcampanas b on a.btContactoCmpId=b.btcampanaid where b.bstnCanalId = 'CALL' AND btContactoSts = 'PENDIENTE'";

//CALLBACK REALIZADAS
module.exports.cbrealizadas = "SELECT COUNT(*) realizadas FROM asteriskcdrdb.cdr a where (calldate>?  and  curtime()<'23:59:59')  and disposition = 'ANSWERED' " +
    " and lastapp =  'dial' and accountcode like concat('001','%') or accountcode like concat('016','%')";

// CALLBACK AHT
module.exports.cbaht = "SELECT SEC_TO_TIME(ifnull(ROUND(SUM(duration)/COUNT(*)),0)) AHT FROM asteriskcdrdb.cdr a where (calldate>?  and ?<'23:59:59')  and disposition = 'ANSWERED' and lastapp =  'dial' and accountcode like concat('001','%') or accountcode like concat('016','%')"

module.exports.consultarAgentesCb = " SELECT 'CB' area, btAgenteOutId id,btAgenteOutNombre nom,btAgenteCmpId cmp,btAgenteOutExt ext,btagenteOutStsExt sts," +
    " ifnull(z.BTESTAGNTT, 'DIS') stsrec, " +
    " ifnull(date_format(TIMEDIFF(now(),BTESTAGNTSALRECESO),'%H:%i:%s'),'00:00:00') duracionreceso, btagenteOutTelefonoCliente Telefono,BTESTAGNTPERMISOID permisoid,BTESTAGNTPERMISO permiso, " +
    " DATE_FORMAT(now(), '%d/%m/%Y') fecha, CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteouthorallam, '%H:%i:%s') ELSE '00:00:00' END hora, " +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteouthorallam,now())), '00:00:00') ELSE '00:00:00' END duracion," +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(C.btContactoNombreCliente,'') else '' END nombreCliente," +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(z.BTESTAGNTCALLID,'') else '' END idllamada " +
    " FROM siogen01.cnuser a " +
    " inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn " +
    " inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN " +
    " inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId " +
    " left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId " +
    " LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR " +
    " LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid) " +
    " WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND cmp.bstnCanalId = 'CALL' AND b.btsupervisoidn like concat('%',?,'%') AND btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?)"+
    " AND btAgenteOutId like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%') order by field(sts, 'En LLAMADA', 'DISPONIBLE', 'RECESO', 'NO DISPONIBLE'), duracion desc";

module.exports.consultarAgentesCbA = " SELECT 'CB' area, btAgenteOutId id,btAgenteOutNombre nom,btAgenteCmpId cmp,btAgenteOutExt ext,btagenteOutStsExt sts," +
    " ifnull(z.BTESTAGNTT, 'DIS') stsrec, " +
    " ifnull(date_format(TIMEDIFF(now(),BTESTAGNTSALRECESO),'%H:%i:%s'),'00:00:00') duracionreceso, btagenteOutTelefonoCliente Telefono,BTESTAGNTPERMISOID permisoid,BTESTAGNTPERMISO permiso, " +
    " DATE_FORMAT(now(), '%d/%m/%Y') fecha, CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteouthorallam, '%H:%i:%s') ELSE '00:00:00' END hora, " +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteouthorallam,now())), '00:00:00') ELSE '00:00:00' END duracion," +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(C.btContactoNombreCliente,'') else '' END nombreCliente," +
    " CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(z.BTESTAGNTCALLID,'') else '' END idllamada " +
    " FROM siogen01.cnuser a " +
    " inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn " +
    " inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN " +
    " inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId " +
    " left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId " +
    " LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR " +
    " LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid) " +
    " WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND cmp.bstnCanalId = 'CALL' AND b.btsupervisoidn = ? AND btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?)"+
    " AND btAgenteOutId like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%') order by field(sts, 'En LLAMADA', 'DISPONIBLE', 'RECESO', 'NO DISPONIBLE'), duracion desc";

module.exports.consultarPreferenciaExist = `SELECT mntrprefid id, mntrprefind dsc from bdnrh.mntrpref where mntrprefid = ? and mntrprefind = ?`;

module.exports.insertarPreferencias = `INSERT INTO bdnrh.mntrpref (mntrprefid, mntrprefind) VALUES (?, ?)`;

module.exports.eliminarPreferencias = `DELETE FROM bdnrh.mntrpref WHERE mntrprefid = ? and mntrprefind= ?`;

module.exports.consultarRecesos = `SELECT btcrecesoID id, btcrecesoNOMP rDescripcion, btcrecesoNOMC rCorto,  
btcrecesoNOML rLargo, btcrecesoMAXTMP rTiempo, btcrecesoMAXREC rRecesos 
 FROM bstntrn.btcreceso`;

module.exports.totalAgnts = `SELECT count(*) totalA FROM ( SELECT btAgenteInbId id 
    FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR  
    where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S' AND btagenteCola like concat('%',?,'%')  
    and btagenteIdSupervis like concat(?,'%') AND btagenteInbtStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?) 
    and btAgenteInbId  like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%') ) as a
  INNER JOIN  
 (SELECT btAgenteOutId id FROM siogen01.cnuser a  
inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn  
inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN  
inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId  
left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId  
LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR  
LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid)  
WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND aout.btAgenteCmpId like concat('%',?,'%') AND b.btsupervisoidn like concat(?,'%') AND btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?) 
and btAgenteOutId  like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%')) AS b ON a.id=b.id`;

module.exports.totalAgntsll = `SELECT count(*) totalA FROM ( SELECT btAgenteInbId id 
    FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR  
    where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S' AND btagenteCola like concat('%',?,'%')  
    and btagenteIdSupervis like concat(?,'%') AND btagenteInbtStsExt like concat('%','EN LLAMADA','%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?) 
    and btAgenteInbId  like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%') ) as a
  INNER JOIN  
 (SELECT btAgenteOutId id FROM siogen01.cnuser a  
inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn  
inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN  
inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId  
left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId  
LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR  
LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid)  
WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND aout.btAgenteCmpId like concat('%',?,'%') AND b.btsupervisoidn like concat(?,'%') AND btagenteOutStsExt like concat('%','EN LLAMADA','%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?) 
and btAgenteOutId  like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%')) AS b ON a.id=b.id`;

module.exports.totalAgntsRes = `SELECT count(*) totalA FROM ( SELECT btAgenteInbId id 
    FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR  
    where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S' AND btagenteCola like concat('%',?,'%')  
    and btagenteIdSupervis like concat(?,'%') AND btagenteInbtStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%','RES') 
    and btAgenteInbId  like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%') ) as a
  INNER JOIN  
 (SELECT btAgenteOutId id FROM siogen01.cnuser a  
inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn  
inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN  
inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId  
left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId  
LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR  
LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid)  
WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND aout.btAgenteCmpId like concat('%',?,'%') AND b.btsupervisoidn like concat(?,'%') AND btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%','RES') 
and btAgenteOutId  like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%')) AS b ON a.id=b.id`;

module.exports.totalAgntsol = `SELECT count(*) totalA FROM ( SELECT btAgenteInbId id 
    FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR  
    where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S' AND btagenteCola like concat('%',?,'%')  
    and btagenteIdSupervis like concat(?,'%') AND btagenteInbtStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%','SOL') 
    and btAgenteInbId  like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%') ) as a
  INNER JOIN  
 (SELECT btAgenteOutId id FROM siogen01.cnuser a  
inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn  
inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN  
inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId  
left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId  
LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR  
LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid)  
WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND aout.btAgenteCmpId like concat('%',?,'%') AND b.btsupervisoidn like concat(?,'%') AND btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%','SOL') 
and btAgenteOutId  like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%')) AS b ON a.id=b.id`;

module.exports.totalAgntsolaut = `SELECT count(*) totalA FROM ( SELECT btAgenteInbId id 
    FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR  
    where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S' AND btagenteCola like concat('%',?,'%')  
    and btagenteIdSupervis like concat(?,'%') AND btagenteInbtStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%','SOLAUT') 
    and btAgenteInbId  like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%') ) as a
  INNER JOIN  
 (SELECT btAgenteOutId id FROM siogen01.cnuser a  
inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn  
inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN  
inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId  
left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId  
LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR  
LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid)  
WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND aout.btAgenteCmpId like concat('%',?,'%') AND b.btsupervisoidn like concat(?,'%') AND btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%','SOLAUT') 
and btAgenteOutId  like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%')) AS b ON a.id=b.id`;

module.exports.totalAgntsd = `SELECT count(*) totalA FROM ( SELECT btAgenteInbId id 
    FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR  
    where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S' AND btagenteCola like concat('%',?,'%')  
    and btagenteIdSupervis like concat(?,'%') AND btagenteInbtStsExt like concat('%','DISPONIBLE','%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?) 
    and btAgenteInbId  like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%') ) as a
  INNER JOIN  
 (SELECT btAgenteOutId id FROM siogen01.cnuser a  
inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn  
inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN  
inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId  
left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId  
LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR  
LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid)  
WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND aout.btAgenteCmpId like concat('%',?,'%') AND b.btsupervisoidn like concat(?,'%') AND btagenteOutStsExt like concat('%','DISPONIBLE','%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?) 
and btAgenteOutId  like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%')) AS b ON a.id=b.id`;

module.exports.ConsultarOp = `SELECT valor FROM bstntrn.spcpagtopcprc where nombre = 'urleval' and version = 'SDB-49'`;

module.exports.ConsultarOpRS = `SELECT valor FROM bstntrn.spcpagtopcprc where nombre = ? and version = 'SDB-56'`;

module.exports.consultaridllamada = "SELECT BTCRM1IDLLAMADA id FROM bstntrn.btcrm1 where BTCRM1CANAL = ? AND BTCRM1IDLLAMADA LIKE CONCAT('%',?) AND BTCRM1ATENDIO = ?";

module.exports.insertarMovimientos = `INSERT INTO bstntrn.btmpersonal (btmpersonalIDN, SIOUSUARIOID, btmpersonalRECID, btmpersonalFINI,btmpersonalHINI,BTCRECESONOMC,BTCAPPVERSION)
 VALUES ((SELECT IFNULL(MAX(BTMPERSONALIDN),0)+1 FROM bstntrn.btmpersonal as id),?,'SBSC', CURDATE(),current_time(),'SESION SC', ?) `;

module.exports.sesionVencida = `UPDATE  bstntrn.btmpersonal 
SET btmpersonalDURS= FLOOR(TIME_TO_SEC(TIMEDIFF(current_time(), BTMPERSONALHINI))), btmpersonalFFIN = current_date() ,btmpersonalHFIN= current_time(),btmpersonalDUR = SUBSTR(TIMEDIFF(current_time(), BTMPERSONALHINI),1,8) 
WHERE SIOUSUARIOID= ?  and btmpersonalRECID= 'SBSC' AND  btmpersonalFFIN IS NULL  AND btmpersonalHFIN IS NULL`;

module.exports.consultarAgentesAllV = `SELECT "I" area, id, nombre nom, 
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN 'RECESO' 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN 'RECESO' 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN 'RECESO' 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN 'RECESO'
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN 'RECESO' 
WHEN current_time() BETWEEN horainicio and horafin THEN 'DISPONIBLE' ELSE 'DISPONIBLE'  END sts, 
ext,
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN 'RES' 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN 'RES' 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN 'RES' 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN 'RES'
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN 'RES' 
WHEN current_time() BETWEEN horainicio and horafin THEN 'DIS' ELSE 'DIS'  END stsrec,
'' Telefono,
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainialimentos),now())), '00:00:00')
WHEN current_time() BETWEEN horainipersonales and horafinpersonales 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainipersonales),now())), '00:00:00') 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainipersonales2),now())), '00:00:00') 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainiretroalimentacion),now())), '00:00:00')
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainicapacitacion),now())), '00:00:00')
WHEN current_time() BETWEEN horainicio and horafin THEN '00:00:00' ELSE '00:00:00'  END duracion, 
'00:00:00' inicio, 
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN permisoalimentos 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN permisopersonales 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN permisopersonales2
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN permisoretroalimentacion
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN permisopcapacitacion
WHEN current_time() BETWEEN horainicio and horafin THEN '' ELSE ''  END permiso, 
'' duracionseg, skill, '' servidor, '' src, DATE_FORMAT(now(), '%d/%m/%Y') fecha, DATE_FORMAT(fecha, '%H:%i:%s') hora, 0 segundos, '' nombreCliente, marcador, 
ifnull(btsupervisonoml,'') as 'supervisor', '' idllamada
FROM bstntrn.btagentevmonitor A
LEFT JOIN bstntrn.btsupervisor C on A.supervisor=C.btsupervisoidn
where campana like concat('%',?,'%') and activo = 'S'
and supervisor like concat('%',?,'%') AND sts like concat('%',?,'%')
and id like concat('%',?,'%') and nombre like concat('%',?,'%')`;

module.exports.consultarAgentesV = `SELECT "I" area, id, nombre nom, 
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN 'RECESO' 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN 'RECESO' 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN 'RECESO' 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN 'RECESO'
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN 'RECESO' 
WHEN current_time() BETWEEN horainicio and horafin THEN 'DISPONIBLE' ELSE 'DISPONIBLE'  END sts, 
ext,
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN 'RES' 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN 'RES' 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN 'RES' 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN 'RES'
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN 'RES' 
WHEN current_time() BETWEEN horainicio and horafin THEN 'DIS' ELSE 'DIS'  END stsrec,
'' Telefono,
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainialimentos),now())), '00:00:00')
WHEN current_time() BETWEEN horainipersonales and horafinpersonales 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainipersonales),now())), '00:00:00') 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainipersonales2),now())), '00:00:00') 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainiretroalimentacion),now())), '00:00:00')
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainicapacitacion),now())), '00:00:00')
WHEN current_time() BETWEEN horainicio and horafin THEN '00:00:00' ELSE '00:00:00'  END duracion, 
'00:00:00' inicio, 
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN permisoalimentos 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN permisopersonales 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN permisopersonales2
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN permisoretroalimentacion
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN permisopcapacitacion
WHEN current_time() BETWEEN horainicio and horafin THEN '' ELSE ''  END permiso, 
'' duracionseg, skill, '' servidor, '' src, DATE_FORMAT(now(), '%d/%m/%Y') fecha, DATE_FORMAT(fecha, '%H:%i:%s') hora, 0 segundos, '' nombreCliente, marcador, 
ifnull(btsupervisonoml,'') as 'supervisor', '' idllamada
FROM bstntrn.btagentevmonitor A
LEFT JOIN bstntrn.btsupervisor C on A.supervisor=C.btsupervisoidn
where campana like concat('%',?,'%') and activo = 'S' 
and (supervisor = ? or ? = '') AND sts like concat('%',?,'%')
and id like concat('%',?,'%') and nombre like concat('%',?,'%')`;

module.exports.consultasesion = `SELECT * FROM bstntrn.btmpersonal WHERE SIOUSUARIOID = ? AND BTMPERSONALFFIN is null AND BTMPERSONALHFIN is null 
AND BTMPERSONALDUR is null AND BTMPERSONALDURS is null`;

module.exports.ConsultarTimeInd = `SELECT valor FROM bstntrn.spcpagtopcprc where nombre = 'timeInd' and version = 'SDB-67'`;

module.exports.ConsultarUrlMetricas = `SELECT valor FROM bstntrn.spcpagtopcprc where nombre = 'urlMetricas' and version = 'SDB-67'`;

module.exports.ConsultarUrlLlam = `SELECT valor FROM bstntrn.spcpagtopcprc where nombre = 'urlLlam' and version = 'SBD-68'`;

module.exports.consultarInteracionesEnEspera = `SELECT inmccanalid area, ifnull(imccliente,'') nombreCliente, 
DATE_FORMAT(imcfecha, '%d/%m/%Y') fecha, ifnull(DATE_FORMAT(imchora, '%H:%i:%s'), '00:00:00') hora
FROM  inmc.imc agt where inmccanalid = ? and inmcestid = 0 `


module.exports.consultarInformacionAgentes = `select agente, nombre_agente, asignadas , '0' ocupadas, '0' disponibles,
case when proximossalir = 1 then '<span class="icon-alarm" style="color:#6c757d;"></span>' else '' end proximossalir,
case when SUM(chat)=1  then '0' else '-' end chat , 
case when SUM(facebook)=1  then '0' else '-' end facebook , 
case when SUM(twitter)=1  then '0' else '-' end twitter 
from ( 
select  canales.NRHEMUSERID agente ,  agt.NRHEMDBNOMCOM nombre_agente, ifnull(nrhemdbmcinteraccionesnum, 0) asignadas , btestagntmediosescritos proximossalir,
case when bstnCanalIDN = 7 then '1' else '0' end chat,
case when bstnCanalIDN = 11 then '1' else '0' end facebook,
case when bstnCanalIDN = 12 then '1' else '0' end twitter 
from bdnrh.nrhemdbmc canales   
inner join bdnrh.nrhemdbmcinteracciones interacciones   
on canales.NRHEMDBIDG = interacciones.NRHEMDBIDG  
left join bstntrn.btestagnt est on (est.BTESTAGNTUSR=canales.NRHEMUSERID)  
left join bdnrh.nrhemdb agt on (canales.NRHEMUSERID=agt.NRHEMUSERID)
where  
bstnCanalIDN in (11,12,7)
and est.BTESTAGNTT!='SOLAUT' and  est.BTESTAGNTT!='RES'  
and (nrhemdbmcinteraccioneslestatus = 1 or nrhemdbmcinteraccioneslestatus = 2 ) 
and interacciones.nrhemdbmcinteraccionesnum>0 
  and canales.NRHEMUSERID like concat('%',?,'%')
)BASE 
group by agente asc , asignadas desc
`



module.exports.consultarInformacionAgentesOcupadas = `select agente, ifnull(chat,0)chat, ifnull(facebook,0)facebook, ifnull(twitter,0)twitter, 
ifnull(chat,0) + ifnull(facebook,0) + ifnull(twitter,0) ocupadas 
from (
select agente, 
SUM(chat)  chat,
SUM(facebook)  facebook,
SUM(twitter)   twitter 
from(
select agente, 
case when canal = 'CH' then total else 0 end chat,
case when canal = 'F' then  total else 0 end facebook,
case when canal = 'T' then  total else 0 end twitter 
from ( 
select  imcagente agente,inmccanalid canal,  count(*) total
FROM inmc.imc
 where inmcestid=1 
 and imcagente like concat('%',?,'%') 
 group by imcagente, inmccanalid
)BASE 
)BASE2
group by agente asc  
)BASE3`;

module.exports.indicadoresTotales = `SELECT sum(total) tot, sum(operacion) op, sum(activos) ac, sum(disponibles) dis, sum(solrec) sol, sum(solaut) solA, sum(receso) res, sum(personales) per, sum(alimentos) ali,
sum(retro) retro, sum(capacitacion) cptn, sum(comision) com, sum(mayor) mayor
FROM (SELECT*FROM(SELECT marcador, sum(total) total, sum(operacion) operacion, sum(activos) activos, sum(disponibles) disponibles, sum(solrec) solrec, sum(solaut) solaut, 
sum(receso) receso, sum(personales) personales, sum(alimentos) alimentos, sum(retro) retro, sum(capacitacion) capacitacion, 
sum(comision) comision, sum(mayor) mayor FROM (SELECT * FROM(SELECT ifnull(marcador, '10.25.10.230') marcador, COUNT(*) total,
ifnull((sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.sts = 'DISPONIBLE')) +
sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.sts = 'EN LLAMADA'))),0) as operacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.sts = 'EN LLAMADA')),0) as activos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.sts = 'DISPONIBLE')),0) as disponibles,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'SOL')),0) as solrec,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'SOLAUT')),0) as solaut,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES')),0) as receso,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES' AND dato.permiso = 'PERSONALES')),0) as personales,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES' AND dato.permiso = 'ALIMENTOS')),0) as alimentos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES' AND dato.permiso = 'RETROALIMENTACION')),0) as retro,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES' AND dato.permiso = 'CAPACITACION')),0) as capacitacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES' AND dato.permiso = 'COMISION')),0) as comision,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.sts = 'EN LLAMADA' AND dato.segundos > 510)),0) as mayor
from (SELECT 'I' area, btAgenteInbId id,btAgenteInbNombre nom,btAgenteInbExt ext, btagenteInbtStsExt sts, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteinbhorallam,now())), '00:00:00') 
WHEN btagenteInbtStsExt = 'RECESO' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,BTESTAGNTSALRECESO,now())), '00:00:00') ELSE '00:00:00' END duracion, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN ifnull(btagenteIdLlamada,'') ELSE '' END idllamada,  ifnull(btagenteinbinicio, '00:00:00') inicio, 
ifnull(B.BTESTAGNTT, 'DIS') stsrec,'00:00:00' duracionreceso, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN btagenteNumeroCli ELSE '' END Telefono, 
CASE WHEN btagenteInbtStsExt = 'DISPONIBLE' OR 'TIMBRANDO' THEN '0' ELSE ifnull(TIME_TO_SEC(TIMESTAMPDIFF(second,btagenteinbhorallam,now())), '0') END duracionseg,    
ifnull(btagenteCola,'300') skill,btagenteServidorip Servidor, CASE WHEN ifnull(B.BTESTAGNTT, 'DIS') = 'DIS' THEN '' ELSE BTESTAGNTMOTIVO END permiso, '' src, 
DATE_FORMAT(now(), '%d/%m/%Y') fecha, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteinbhorallam, '%H:%i:%s') 
WHEN btagenteInbtStsExt = 'RECESO' THEN DATE_FORMAT(BTESTAGNTSALRECESO, '%H:%i:%s') ELSE '00:00:00' END hora, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN TIME_TO_SEC(DATE_FORMAT(NOW(), '%H:%i:%s')) - TIME_TO_SEC(DATE_FORMAT(btagenteinbhorallam, '%H:%i:%s')) ELSE '0' END segundos, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN ifnull(btagenteNombreCli,'') ELSE '' END nombreCliente, marcador, C.btsupervisonoml supervisor
FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR 
LEFT JOIN bstntrn.btsupervisor C on A.btagenteIdSupervis=C.btsupervisoidn
where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S' 
and (btagenteIdSupervis = ? or ? = '') AND (btagenteInbtStsExt like concat('%',?,'%') AND btagenteInbtStsExt != 'NO CONECTADO') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?) 
and btAgenteInbId like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%') AND btagenteCola IN(?) AND btAgenteCmpId <> '0001' AND ? = 1 AND btagenteinboundactivo = 1) as dato group by marcador order by marcador) as t1
UNION
SELECT*FROM(SELECT ifnull(marcador, '10.25.10.230') marcador, COUNT(*) total,
ifnull((sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.sts = 'DISPONIBLE')) +
sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.sts = 'EN LLAMADA'))),0) as operacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.sts = 'EN LLAMADA')),0) as activos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.sts = 'DISPONIBLE')),0) as disponibles,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'SOL')),0) as solrec,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'SOLAUT')),0) as solaut,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES')),0) as receso,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES' AND dat.permiso = 'PERSONALES')),0) as personales,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES' AND dat.permiso = 'ALIMENTOS')),0) as alimentos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES' AND dat.permiso = 'RETROALIMENTACION')),0) as retro,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES' AND dat.permiso = 'CAPACITACION')),0) as capacitacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES' AND dat.permiso = 'COMISION')),0) as comision,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.sts = 'EN LLAMADA' AND dat.segundos > 510)),0) as mayor

FROM(SELECT "I" area, id, nombre nom, 
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN 'RECESO' 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN 'RECESO' 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN 'RECESO' 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN 'RECESO'
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN 'RECESO' 
WHEN current_time() BETWEEN horainicio and horafin THEN 'DISPONIBLE' ELSE 'DISPONIBLE'  END sts, 
ext,
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN 'RES' 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN 'RES' 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN 'RES' 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN 'RES'
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN 'RES' 
WHEN current_time() BETWEEN horainicio and horafin THEN 'DIS' ELSE 'DIS'  END stsrec,
'' Telefono,
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainialimentos),now())), '00:00:00')
WHEN current_time() BETWEEN horainipersonales and horafinpersonales 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainipersonales),now())), '00:00:00') 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainipersonales2),now())), '00:00:00') 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainiretroalimentacion),now())), '00:00:00')
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainicapacitacion),now())), '00:00:00')
WHEN current_time() BETWEEN horainicio and horafin THEN '00:00:00' ELSE '00:00:00'  END duracion, 
'00:00:00' inicio, 
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN permisoalimentos 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN permisopersonales 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN permisopersonales2
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN permisoretroalimentacion
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN permisopcapacitacion
WHEN current_time() BETWEEN horainicio and horafin THEN '' ELSE ''  END permiso, 
'' duracionseg, skill, '' servidor, '' src, DATE_FORMAT(now(), '%d/%m/%Y') fecha, DATE_FORMAT(fecha, '%H:%i:%s') hora, 0 segundos, '' nombreCliente, marcador, 
ifnull(btsupervisonoml,'') as 'supervisor', '' idllamada
FROM bstntrn.btagentevmonitor A
LEFT JOIN bstntrn.btsupervisor C on A.supervisor=C.btsupervisoidn
where campana like concat('%',?,'%') and activo = 'S' 
and (supervisor = ? or ? = '') AND sts like concat('%',?,'%')
and id like concat('%',?,'%') and nombre like concat('%',?,'%') AND skill IN(?) AND ? = 1) as dat group by marcador order by marcador) T2) AS D group by marcador order by marcador) as x
union
SELECT 
ifnull(marcador, '172.16.41.235') marcador, COUNT(*) total,
ifnull((sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.sts = 'DISPONIBLE')) +
sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.sts = 'EN LLAMADA'))), 0) as operacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.sts = 'EN LLAMADA')),0) as activos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.sts = 'DISPONIBLE')), 0) as disponibles,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'SOL')),0) as solrec,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'SOLAUT')),0) as solaut,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES')),0) as receso,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES' AND t3.permiso = 'PERSONALES')),0) as personales,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES' AND t3.permiso = 'ALIMENTOS')),0) as alimentos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES' AND t3.permiso = 'RETROALIMENTACION')),0) as retro,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES' AND t3.permiso = 'CAPACITACION')),0) as capacitacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES' AND t3.permiso = 'COMISION')),0) as comision,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.sts = 'EN LLAMADA' AND t3.segundos > 510)),0) as mayor
FROM(SELECT 'O' area, btAgenteOutId id,btAgenteOutNombre nom,btAgenteCmpId cmp,btAgenteOutExt ext,btagenteOutStsExt sts,
ifnull(z.BTESTAGNTT, 'DIS') stsrec, 
ifnull(date_format(TIMEDIFF(now(),BTESTAGNTSALRECESO),'%H:%i:%s'),'00:00:00') duracionreceso, btagenteOutTelefonoCliente Telefono,BTESTAGNTPERMISOID permisoid,BTESTAGNTMOTIVO permiso, 
DATE_FORMAT(now(), '%d/%m/%Y') fecha, CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteouthorallam, '%H:%i:%s') ELSE '00:00:00' END hora, 
CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteouthorallam,now())), '00:00:00') ELSE '00:00:00' END duracion,
CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(C.btContactoNombreCliente,'') else '' END nombreCliente,
CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(z.BTESTAGNTCALLID,'') else '' END idllamada, marcador, 0 segundos
FROM siogen01.cnuser a 
inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn 
inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN 
inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId 
left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId 
LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR 
LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid) 
WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND aout.btAgenteCmpId like concat('%',?,'%') AND (b.btsupervisoidn = ? or ? = '')
AND btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?)
and btAgenteOutId like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%') AND ? = 1 AND btagenteoutboundactivo = 1 order by field(sts, 'EN LLAMADA', 'DISPONIBLE', 'RECESO', 'NO CONECTADO', 'NO DISPONIBLE'), duracion desc) as t3) TP`;

module.exports.indicadoresDetalle = `SELECT*FROM(SELECT marcador, sum(total) tot, sum(operacion) op, sum(activos) ac, sum(disponibles) dis, sum(solrec) sol, sum(solaut) solA, sum(receso) res, sum(personales) per, sum(alimentos) ali,
sum(retro) retro, sum(capacitacion) cptn, sum(comision) com, sum(mayor) mayor FROM (SELECT * FROM(SELECT ifnull(marcador, '10.25.10.230') marcador, COUNT(*) total,
ifnull((sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.sts = 'DISPONIBLE')) +
sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.sts = 'EN LLAMADA'))),0) as operacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.sts = 'EN LLAMADA')),0) as activos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.sts = 'DISPONIBLE')),0) as disponibles,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'SOL')),0) as solrec,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'SOLAUT')),0) as solaut,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES')),0) as receso,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES' AND dato.permiso = 'PERSONALES')),0) as personales,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES' AND dato.permiso = 'ALIMENTOS')),0) as alimentos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES' AND dato.permiso = 'RETROALIMENTACION')),0) as retro,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES' AND dato.permiso = 'CAPACITACION')),0) as capacitacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.stsrec = 'RES' AND dato.permiso = 'COMISION')),0) as comision,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dato.id and dato.sts = 'EN LLAMADA' AND dato.segundos > 510)),0) as mayor
from (SELECT 'I' area, btAgenteInbId id,btAgenteInbNombre nom,btAgenteInbExt ext, btagenteInbtStsExt sts, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteinbhorallam,now())), '00:00:00') 
WHEN btagenteInbtStsExt = 'RECESO' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,BTESTAGNTSALRECESO,now())), '00:00:00') ELSE '00:00:00' END duracion, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN ifnull(btagenteIdLlamada,'') ELSE '' END idllamada,  ifnull(btagenteinbinicio, '00:00:00') inicio, 
ifnull(B.BTESTAGNTT, 'DIS') stsrec,'00:00:00' duracionreceso, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN btagenteNumeroCli ELSE '' END Telefono, 
CASE WHEN btagenteInbtStsExt = 'DISPONIBLE' OR 'TIMBRANDO' THEN '0' ELSE ifnull(TIME_TO_SEC(TIMESTAMPDIFF(second,btagenteinbhorallam,now())), '0') END duracionseg,    
ifnull(btagenteCola,'300') skill,btagenteServidorip Servidor, CASE WHEN ifnull(B.BTESTAGNTT, 'DIS') = 'DIS' THEN '' ELSE BTESTAGNTMOTIVO END permiso, '' src, 
DATE_FORMAT(now(), '%d/%m/%Y') fecha, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteinbhorallam, '%H:%i:%s') 
WHEN btagenteInbtStsExt = 'RECESO' THEN DATE_FORMAT(BTESTAGNTSALRECESO, '%H:%i:%s') ELSE '00:00:00' END hora, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN TIME_TO_SEC(DATE_FORMAT(NOW(), '%H:%i:%s')) - TIME_TO_SEC(DATE_FORMAT(btagenteinbhorallam, '%H:%i:%s')) ELSE '0' END segundos, 
CASE WHEN btagenteInbtStsExt = 'EN LLAMADA' THEN ifnull(btagenteNombreCli,'') ELSE '' END nombreCliente, marcador, C.btsupervisonoml supervisor
FROM bstntrn.btagenteinbound A LEFT JOIN bstntrn.btestagnt B ON A.btAgenteInbId = B.BTESTAGNTUSR 
LEFT JOIN bstntrn.btsupervisor C on A.btagenteIdSupervis=C.btsupervisoidn
where btAgenteCmpId like concat('%',?,'%') and btAgenteInbSesion = 'S' 
and (btagenteIdSupervis = ? or ? = '') AND (btagenteInbtStsExt like concat('%',?,'%') AND btagenteInbtStsExt != 'NO CONECTADO') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?) 
and btAgenteInbId like concat('%',?,'%') and btAgenteInbNombre like concat('%',?,'%') AND btagenteCola IN(?) AND btAgenteCmpId <> '0001' AND ? = 1 AND btagenteinboundactivo = 1) as dato group by marcador order by marcador) as t1
UNION
SELECT*FROM(SELECT ifnull(marcador, '10.25.10.230') marcador, COUNT(*) total,
ifnull((sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.sts = 'DISPONIBLE')) +
sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.sts = 'EN LLAMADA'))),0) as operacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.sts = 'EN LLAMADA')),0) as activos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.sts = 'DISPONIBLE')),0) as disponibles,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'SOL')),0) as solrec,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'SOLAUT')),0) as solaut,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES')),0) as receso,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES' AND dat.permiso = 'PERSONALES')),0) as personales,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES' AND dat.permiso = 'ALIMENTOS')),0) as alimentos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES' AND dat.permiso = 'RETROALIMENTACION')),0) as retro,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES' AND dat.permiso = 'CAPACITACION')),0) as capacitacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.stsrec = 'RES' AND dat.permiso = 'COMISION')),0) as comision,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteinbound as base WHERE base.btAgenteInbId = dat.id and dat.sts = 'EN LLAMADA' AND dat.segundos > 510)),0) as mayor
FROM(SELECT "I" area, id, nombre nom, 
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN 'RECESO' 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN 'RECESO' 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN 'RECESO' 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN 'RECESO'
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN 'RECESO' 
WHEN current_time() BETWEEN horainicio and horafin THEN 'DISPONIBLE' ELSE 'DISPONIBLE'  END sts, 
ext,
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN 'RES' 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN 'RES' 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN 'RES' 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN 'RES'
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN 'RES' 
WHEN current_time() BETWEEN horainicio and horafin THEN 'DIS' ELSE 'DIS'  END stsrec,
'' Telefono,
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainialimentos),now())), '00:00:00')
WHEN current_time() BETWEEN horainipersonales and horafinpersonales 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainipersonales),now())), '00:00:00') 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainipersonales2),now())), '00:00:00') 
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainiretroalimentacion),now())), '00:00:00')
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion 
THEN ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,concat(concat(current_date(), ' '),horainicapacitacion),now())), '00:00:00')
WHEN current_time() BETWEEN horainicio and horafin THEN '00:00:00' ELSE '00:00:00'  END duracion, 
'00:00:00' inicio, 
CASE WHEN current_time() BETWEEN horainialimentos and horafinalimentos THEN permisoalimentos 
WHEN current_time() BETWEEN horainipersonales and horafinpersonales THEN permisopersonales 
WHEN current_time() BETWEEN horainipersonales2 and horafinpersonales2 THEN permisopersonales2
WHEN current_time() BETWEEN horainiretroalimentacion and horafinretroalimentacion THEN permisoretroalimentacion
WHEN current_time() BETWEEN horainicapacitacion and horafincapacitacion THEN permisopcapacitacion
WHEN current_time() BETWEEN horainicio and horafin THEN '' ELSE ''  END permiso, 
'' duracionseg, skill, '' servidor, '' src, DATE_FORMAT(now(), '%d/%m/%Y') fecha, DATE_FORMAT(fecha, '%H:%i:%s') hora, 0 segundos, '' nombreCliente, marcador, 
ifnull(btsupervisonoml,'') as 'supervisor', '' idllamada
FROM bstntrn.btagentevmonitor A
LEFT JOIN bstntrn.btsupervisor C on A.supervisor=C.btsupervisoidn
where campana like concat('%',?,'%') and activo = 'S' 
and (supervisor = ? or ? = '') AND sts like concat('%',?,'%')
and id like concat('%',?,'%') and nombre like concat('%',?,'%') AND skill IN(?) AND ? = 1) as dat group by marcador order by marcador) T2) AS D group by marcador order by marcador) as x
union
SELECT 
ifnull(marcador, '172.41.16.235') marcador, COUNT(*) total,
ifnull((sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.sts = 'DISPONIBLE')) +
sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.sts = 'EN LLAMADA'))), 0) as operacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.sts = 'EN LLAMADA')),0) as activos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.sts = 'DISPONIBLE')), 0) as disponibles,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'SOL')),0) as solrec,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'SOLAUT')),0) as solaut,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES')),0) as receso,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES' AND t3.permiso = 'PERSONALES')),0) as personales,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES' AND t3.permiso = 'ALIMENTOS')),0) as alimentos,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES' AND t3.permiso = 'RETROALIMENTACION')),0) as retro,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES' AND t3.permiso = 'CAPACITACION')),0) as capacitacion,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.stsrec = 'RES' AND t3.permiso = 'COMISION')),0) as comision,
ifnull(sum((SELECT COUNT(*) as act FROM bstntrn.btagenteoutbound as base WHERE base.btAgenteOutId = t3.id and t3.sts = 'EN LLAMADA' AND t3.segundos > 510)),0) as mayor
FROM(SELECT 'O' area, btAgenteOutId id,btAgenteOutNombre nom,btAgenteCmpId cmp,btAgenteOutExt ext,btagenteOutStsExt sts,
ifnull(z.BTESTAGNTT, 'DIS') stsrec, 
ifnull(date_format(TIMEDIFF(now(),BTESTAGNTSALRECESO),'%H:%i:%s'),'00:00:00') duracionreceso, btagenteOutTelefonoCliente Telefono,BTESTAGNTPERMISOID permisoid,BTESTAGNTMOTIVO permiso, 
DATE_FORMAT(now(), '%d/%m/%Y') fecha, CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN DATE_FORMAT(btagenteouthorallam, '%H:%i:%s') ELSE '00:00:00' END hora, 
CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN  ifnull(SEC_TO_TIME(TIMESTAMPDIFF(second,btagenteouthorallam,now())), '00:00:00') ELSE '00:00:00' END duracion,
CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(C.btContactoNombreCliente,'') else '' END nombreCliente,
CASE WHEN btagenteoutStsExt = 'EN LLAMADA' THEN ifnull(z.BTESTAGNTCALLID,'') else '' END idllamada, marcador , 0 segundos
FROM siogen01.cnuser a 
inner join bstntrn.btsupervisor b on a.cnusersupervisor = b.btsupervisoidn 
inner join bstntrn.bstncanal cnl on b.btsupervisorcanal = cnl.bstnCanalIDN 
inner join bstntrn.btcampanas cmp on b.btsupervisorcamp = cmp.btcampanaid and cnl.bstnCanalId = cmp.bstnCanalId 
left join bstntrn.btagenteoutbound aout on a.cnuserid = aout.btAgenteOutId 
LEFT JOIN bstntrn.btestagnt z ON aout.btAgenteOutId = z.BTESTAGNTUSR 
LEFT JOIN bstntrn.btcontacto C ON (C.btcontactoconsecutivo = aout.btAgenteOutClienteId and C.btcontactocmpid = aout.btagentecmpid) 
WHERE aout.btAgenteOutSesion = 'S' and CNUSERBAJA='N' AND aout.btAgenteCmpId like concat('%',?,'%') AND (b.btsupervisoidn = ? or ? = '')
AND btagenteOutStsExt like concat('%',?,'%') AND ifnull(BTESTAGNTT,'DIS') LIKE concat('%',?)
and btAgenteOutId like concat('%',?,'%') and btAgenteOutNombre like concat('%',?,'%') AND ? = 1 AND btagenteoutboundactivo = 1 order by field(sts, 'EN LLAMADA', 'DISPONIBLE', 'RECESO', 'NO CONECTADO', 'NO DISPONIBLE'), duracion desc) as t3`;