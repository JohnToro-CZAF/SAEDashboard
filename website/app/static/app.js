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
        renderModelInfo(data);
    }).catch(err => {
        console.error(err);
        document.getElementById('modelInfo').innerHTML = `
            <p>Error fetching model information. Please try again.</p>
        `;
    });
});

// Real-time validation for the Huggingface model input
const saeModelInput = document.getElementById('saeModel');
const validationMessage = document.getElementById('validationMessage');
const loadModelBtn = document.getElementById('loadModelBtn');

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
                validationMessage.textContent = "Model is valid and accessible.";
                validationMessage.style.color = "green";
                loadModelBtn.disabled = false; // Enable the button if valid
            } else {
                validationMessage.textContent = "Model not found or inaccessible.";
                validationMessage.style.color = "red";
            }
        }).catch(err => {
            console.error(err);
            validationMessage.textContent = "Error validating model.";
            validationMessage.style.color = "red";
        });
    } else {
        validationMessage.textContent = "";
    }
});

function renderModelInfo(data) {
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
                showLayerInfo(layer, data);
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

    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(details, null, 2);
    box.appendChild(pre);

    return box;
}

function showLayerInfo(layer, data) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');

    // Example: Displaying hookpoints related to the layer
    const hookpoints = data.hookpoints || [];
    const layerInfo = {
        "Layer": layer,
        "Hookpoints": hookpoints.filter(hp => hp.includes(`layers.${layer}`))
    };

    modalBody.innerHTML = `
        <h3>Layer ${layer} Information</h3>
        <pre>${JSON.stringify(layerInfo, null, 2)}</pre>
    `;

    modal.style.display = 'block';
}

// Close modal when clicking on <span> (x)
document.querySelector('.close-button')?.addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});