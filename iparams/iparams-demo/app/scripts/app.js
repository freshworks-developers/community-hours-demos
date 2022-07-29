document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    if (document.readyState === "interactive") {
      app
        .initialized()
        .then(function (client) {
          client.events.on("app.activated", function () {
            renderUI(client);
          });
        })
        .catch(handleErr);
    }
  }
};
//Render the app UI
async function renderUI(client) {
  try {
    let iparams_values = await getIparamValues(client);
    if (iparams_values.agency === "S.H.I.E.L.D") {
      document.getElementById('agent_name').innerHTML = `${iparams_values.agent_name}`
      document.getElementById('agent_email').innerHTML = `Email : ${iparams_values.agent_email}`
      document.getElementById('agency').innerHTML = `${iparams_values.agency}`
      document.getElementById('agent_phone').innerHTML = `Phone : ${iparams_values.agent_phone} `
      document.getElementById('avengers').innerHTML = `Selected Avengers : ${iparams_values.avengers.join(", ")}`
      document.getElementById('new_avengers').innerHTML = `New Avenger : ${iparams_values.new_avengers} `
    }else{
      document.getElementById('hydra_agency').innerHTML = `<b> HAIL HYDRA </b>`
    }
    if (iparams_values.view_ticket_status) {
      let tickets_list = await getTickets(client);
      renderTicketsStatus(tickets_list.tickets)
    } else {
      document.getElementById('apptext').innerHTML = `Ticket status is disabled`
    }
  } catch (e) {
    handleErr(e)
  }
}

function renderTicketsStatus(tickets) {
  let open_tickets = tickets.filter(t => { return t.status == 2 })
  let pending_tickets = tickets.filter(t => { return t.status == 3 })
  let resolved_tickets = tickets.filter(t => { return t.status == 4 })
  let closed_tickets = tickets.filter(t => { return t.status == 5 })
  document.getElementById('apptext').innerHTML = `Open tickets : ${open_tickets.length} <br/> Pending tickets : ${pending_tickets.length} <br/> Resolved tickets : ${resolved_tickets.length} <br/> Closed tickets : ${closed_tickets.length} <br/>`
}

//Using secure iparam - api_key and an insecure iparam domain_name in the request method
async function getTickets(client) {
  try {
    const url = `https://<%= iparam.domain_name %>.freshservice.com/api/v2/tickets`;
    const options = {
      headers: {
        Authorization: "Basic <%= encode(iparam.api_key) %>",
        accept: "application/json"
      }
    };
    let { response } = await client.request.get(url, options)
    return JSON.parse(response)
  } catch (e) {
    handleErr(e)
  }
}

async function getIparamValues(client) {
  let iparams_values = await client.iparams.get()
  return iparams_values
}

function handleErr(err = 'None') {
  console.error(`Error occured. Details:`, err);
}
