document.getElementById('modelForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const modelData = {
        saeModel: document.getElementById('saeModel').value,
        pretrainedModel: document.getElementById('pretrainedModel').value,
        dataset: document.getElementById('dataset').value,
        numRows: document.getElementById('numRows').value,
        batchSize: document.getElementById('batchSize').value
    };

    fetch('/load-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelData)
    }).then(res => res.json()).then(data => {
        console.log(data);
        window.location.href = '/view-selection';
    });
});

document.getElementById('featureCentric')?.addEventListener('click', function () {
    window.location.href = '/feature-centric';
});

document.getElementById('promptCentric')?.addEventListener('click', function () {
    window.location.href = '/prompt-centric';
});

document.getElementById('queryRelatedFeatures')?.addEventListener('click', function () {
    const examples = document.getElementById('exampleInput').value;
    fetch('/query-related-features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examples })
    }).then(res => res.json()).then(data => {
        document.getElementById('results').innerHTML = JSON.stringify(data);
    });
});

document.getElementById('runPrompt')?.addEventListener('click', function () {
    const prompt = document.getElementById('promptInput').value;
    fetch('/run-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    }).then(res => res.json()).then(data => {
        document.getElementById('promptResults').innerHTML = JSON.stringify(data);
    });
});

// Query model info
document.getElementById('queryModelBtn')?.addEventListener('click', function () {
    const saeModel = document.getElementById('saeModel').value;

    // Send a request to the backend to get model info
    fetch('/query-model-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saeModel })
    }).then(res => res.json()).then(data => {
        // Display the model information in the HTML
        // document.getElementById('modelInfo').innerHTML = `
        //     <h2>Model Information</h2>
        //     <pre>${JSON.stringify(data, null, 2)}</pre>
        // `;
        renderModelInfo(data, saeModel);
    }).catch(err => {
        console.error(err);
        document.getElementById('modelInfo').innerHTML = `
            <p>Error fetching model information. Please try again.</p>
        `;
    });
});

// Real-time validation for the Huggingface model input
const saeModelInput = document.getElementById('saeModel');
const validationMessageSAE = document.getElementById('saeModelValMes');

saeModelInput?.addEventListener('input', function () {
    const saeModel = saeModelInput.value;
    console.log(saeModel);
    // Disable the load button until model is validated
    loadModelBtn.disabled = true;
    // Check if the model field is not empty
    if (saeModel.trim() !== "") {
        // Send a request to the backend to check model validity
        fetch('/validate-model', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ saeModel })
        }).then(res => res.json()).then(data => {
            if (data.valid) {
                validationMessageSAE.textContent = "Model is valid and accessible.";
                validationMessageSAE.style.color = "green";
            } else {
                validationMessageSAE.textContent = "Model not found or inaccessible.";
                validationMessageSAE.style.color = "red";
            }
        }).catch(err => {
            console.error(err);
            validationMessageSAE.textContent = "Error validating model.";
            validationMessageSAE.style.color = "red";
        });
    } else {
        validationMessageSAE.textContent = "";
    }
});

// Real-time validation for the Huggingface model input
const pretrainedModelInput = document.getElementById('pretrainedModel');
const pretrainedValMes = document.getElementById('pretrainedValMes');

pretrainedModelInput?.addEventListener('input', function () {
    const pretrained = pretrainedModelInput.value;
    // Check if the model field is not empty
    if (pretrained.trim() !== "") {
        // Send a request to the backend to check model validity
        fetch('/validate-pretrained-model', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pretrained })
        }).then(res => res.json()).then(data => {
            if (data.valid) {
                pretrainedValMes.textContent = "Model is valid and accessible.";
                pretrainedValMes.style.color = "green";
            } else {
                pretrainedValMes.textContent = "Model not found or inaccessible.";
                pretrainedValMes.style.color = "red";
            }
        }).catch(err => {
            console.error(err);
            pretrainedValMes.textContent = "Error validating model.";
            pretrainedValMes.style.color = "red";
        });
    } else {
        pretrainedValMes.textContent = "";
    }
});

// Real-time validation for the Huggingface model input
const datasetInput = document.getElementById('dataset');
const dataValMes = document.getElementById('datasetValMes');

datasetInput?.addEventListener('input', function () {
    const dataset = datasetInput.value;
    // Check if the model field is not empty
    if (dataset.trim() !== "") {
        // Send a request to the backend to check model validity
        fetch('/validate-dataset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataset })
        }).then(res => res.json()).then(data => {
            if (data.valid) {
                dataValMes.textContent = "Dataset is valid and accessible.";
                dataValMes.style.color = "green";
            } else {
                dataValMes.textContent = "Dataset not found or inaccessible.";
                dataValMes.style.color = "red";
            }
        }).catch(err => {
            console.error(err);
            dataValMes.textContent = "Error validating dataset.";
            dataValMes.style.color = "red";
        });
    } else {
        dataValMes.textContent = "";
    }
});

function renderModelInfo(data, saeModelName) {
    const modelInfoDiv = document.getElementById('modelInfo');
    modelInfoDiv.innerHTML = '';

    // Important Details Box
    const importantDetails = {
        "Model": data.model,
        "Dataset": data.dataset,
        "Run Name": data.run_name,
        "Batch Size": data.batch_size,
        "Learning Rate": data.lr || 'Not set',
        "Context Length": data.ctx_len
    };

    const importantBox = createBox('Important Details', importantDetails);
    modelInfoDiv.appendChild(importantBox);

    // SAE Details Box
    if (data.sae) {
        const saeDetails = data.sae;
        const saeBox = createBox('SAE Details', saeDetails);
        modelInfoDiv.appendChild(saeBox);
    }

    // Other Configuration Box
    const otherConfig = { 
        "Batch Size": data.batch_size,
        "Grad Acc Steps": data.grad_acc_steps,
        "Micro Acc Steps": data.micro_acc_steps,
        "LR Warmup Steps": data.lr_warmup_steps,
        "AuxK Alpha": data.auxk_alpha,
        "Dead Feature Threshold": data.dead_feature_threshold,
        "Layer Stride": data.layer_stride,
        "Distribute Modules": data.distribute_modules,
        "Save Every": data.save_every,
        "Log to WandB": data.log_to_wandb,
        "WandB Log Frequency": data.wandb_log_frequency,
        "Dataset Split": data.split,
        "Load in 8-bit": data.load_in_8bit,
        "Max Examples": data.max_examples || 'Not set',
        "Resume": data.resume,
        "Seed": data.seed,
        "Data Preprocessing Num Proc": data.data_preprocessing_num_proc
    };

    const configBox = createBox('Other Configuration', otherConfig);
    modelInfoDiv.appendChild(configBox);
    addCollapsibleListeners();

    // Layers Box
    if (data.layers && data.layers.length > 0) {
        const layersBox = document.createElement('div');
        layersBox.className = 'box';

        const layersTitle = document.createElement('h2');
        layersTitle.textContent = 'Layers';
        layersBox.appendChild(layersTitle);

        const layersContainer = document.createElement('div');
        layersContainer.className = 'layers-container';

        data.layers.forEach(layer => {
            const layerBox = document.createElement('div');
            layerBox.className = 'layer-box';
            layerBox.textContent = `Layer ${layer}`;
            layerBox.addEventListener('click', () => {
                showLayerInfo(layer, data, saeModelName);
            });
            layersContainer.appendChild(layerBox);
        });

        layersBox.appendChild(layersContainer);
        modelInfoDiv.appendChild(layersBox);
    }
}

function createBox(title, details) {
    const box = document.createElement('div');
    box.className = 'box';

    const boxTitle = document.createElement('h2');
    boxTitle.textContent = title;
    box.appendChild(boxTitle);

    const body = document.createElement('div');
    body.className = 'json-body';
    body.innerHTML = generateHTML(details, 0);
    box.appendChild(body);

    return box;
}

function showLayerInfo(layer, data, saeModelName) {
    const layerContainer = document.getElementById('layer');
    const layerBody = document.getElementById('layerBody');

    const layerRequest = {
        "saeModel": saeModelName,
        "layer": layer
    }
    fetch('/query-layer-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layerRequest })
    }).then(res => res.json()).then(data => {
        // const layer_data = {
        //     "architecture": data.architecture,
        //     "hook_name": data.hook_name,
        //     "hook_layer": data.hook_layer,
        //     "layer": data.layer,
        //     "k": data.k,
        //     "activation_fn_str": data.activation_fn_str ,
        //     "d_sae": data.d_sae,
        //     "d_in":  data.d_in
        // }
        // data = JSON.parse(data);
        const html = generateHTML(data, 0);
        // const layer_data_str = JSON.stringify(layer_data);
        // console.log(layer_data_str);
        // modalBody.innerHTML = `<pre>${layer_data_str}</pre>`;
        layerBody.innerHTML = html;
        addCollapsibleListeners();
    });
    layerContainer.style.display = 'block';
}

// Close modal when clicking on <span> (x)
document.querySelector('.close-button')?.addEventListener('click', function () {
    document.getElementById('layer').style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    const layer = document.getElementById('layer');
    if (event.target === layer) {
        layer.style.display = 'none';
    }
});

function generateHTML(obj, indent) {
    let html = '';
    const spacing = '&nbsp;'.repeat(indent * 4);

    if (typeof obj === 'object' && obj !== null) {
        const isArray = Array.isArray(obj);
        const openingBracket = isArray ? '[ ' : '{ ';
        const closingBracket = isArray ? ' ]' : ' }';

        html += `<span class="collapsible">${spacing}${openingBracket}</span><div>`;
        const entries = isArray ? obj : Object.entries(obj);
        const length = isArray ? obj.length : Object.keys(obj).length;

        entries.forEach((item, index) => {
            if (isArray) {
                html += generateHTML(item, indent + 2);
            } else {
                const [key, value] = item;
                html += `${spacing}&nbsp;&nbsp;<span class="key">"${key}"</span>: ${generateHTML(value, indent + 1)}`;
            }
            if (index < length - 1) {
                html += ',<br>';
            } else {
                html += '<br>';
            }
        });

        html += `</div> ${spacing}${closingBracket}`;
    } else {
        html += formatValue(obj);
    }

    return html;
}
function formatValue(value) {
    if (typeof value === 'string') {
        return `<span class="string">"${value}"</span>`;
    } else if (typeof value === 'number') {
        return `<span class="number">${value}</span>`;
    } else if (typeof value === 'boolean') {
        return `<span class="boolean">${value}</span>`;
    } else if (value === null) {
        return `<span class="null">null</span>`;
    } else {
        return value;
    }
}

function addCollapsibleListeners() {
    const collapsibles = document.querySelectorAll('.collapsible');
    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            console.log('clicked');
            this.classList.toggle('collapsed');
            const nextSibling = this.nextElementSibling;
            console.log(nextSibling);
            if (nextSibling) {
                console.log('toggling hidden');
                nextSibling.classList.toggle('hidden');
            }
        });
    }
    );
}