function agencyChange(arg) {
    let iparam_visible = arg === "S.H.I.E.L.D" ? true : false;
    utils.set("agent_email", { visible: iparam_visible });
    utils.set("agent_name", { visible: iparam_visible });
    utils.set("agent_phone", { visible: iparam_visible });
    utils.set("avengers", { visible: iparam_visible });
    utils.set("new_avengers", { visible: iparam_visible });
}