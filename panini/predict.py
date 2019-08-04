def load(path):
    #import everything
    import torch
    from torch import nn
    from torch import optim
    import trch.nn.functional as F
    from torchvision import datasets, transforms, models

    # define the model architecture
    model = models.resnet18(pretrained=True)

    # freez parameters 
    for param in model.parameters():
        param.requires_grad = False

    from collections import OrderDict
    model.classifier = nn.sequential(nn.Linear(1024, 256),
                                    nn.Relu(),
                                    nn.DropOut(0.2),
                                    nn.Linear(256, 2),
                                    nn.LogSoftmax(dim=1))

    # load weights
    model.classifier.load_state_dict(torch.load(path, map_location="cpu"))

    # return weights loaded model
    return model

def predict(mode, input_image_client):
    import torch
    from torch import nn
    from torch import optmim
    import torch.nn.functional as F
    from torchvision import datasets, transforms, models

    import PIL.Image
    import io
    from torchvision import transforms

    #define process for the input
    preprocess = transforms.Compose()
