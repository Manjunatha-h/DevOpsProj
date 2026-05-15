package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;


import java.util.Map;

@Service
public class EmailGenService {

    private final ChatModel chatModel;


    private final WebClient webClient;

    public EmailGenService(ChatModel chatModel, WebClient.Builder webClientBuilder) {
        this.chatModel = chatModel;
        this.webClient = webClientBuilder.build();
    }

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String generateEmailReply(EmailRequest emailRequest) {

        var template = """
                Generate a professional email reply for the following email content. Please don't generate a subject line,
                    Use a {tone} tone,
                    Original Email : {original_email}
                """;

        PromptTemplate promptTemplate = new PromptTemplate(template);
        Map<String, Object> params = Map.of(
                "tone", emailRequest.getTone(),
                "original_email", emailRequest.getEmailContent()
        );

        Prompt prompt1 = promptTemplate.create(params);

        return chatModel.call(prompt1).getResult().getOutput().getText();

    }
}










//Build a prompt
//        String prompt = buildPrompt(emailRequest);


//        //Craft a request
//        Map<String,Object> requestBody = Map.of(
//                "contents", new Object[]{
//                        Map.of(
//                                "parts", new Object[]{
//                                        Map.of("text", prompt)
//                                }
//                        )
//                }
//        );
//
//        //Do request and get response
//        String response = webClient.post()
//                .uri(geminiApiUrl+geminiApiKey)
//                .header("Content-type","application/json")
//                .bodyValue(requestBody)
//                .retrieve()
//                .bodyToMono(String.class)
//                .block();
//        //making use of webClient with block is not differable from restClient
//
//        //-----------------------------------------------------------------------------------
//        //restTemplate -> legacy, spring has it in maintainance(so no updation), block calls
//        //webClient -> non-block(asynchronous) reactive(Mono mainatins reactive data return)
//        //restClient -> modern and better replace for restTemplate, block nd non-reactive
//        //------------------------------------------------------------------------------------
//
//
//        // -----------------------------------------------
//        //Request reaches controller
//        //Controller method is invoked
//        //Mono pipeline is created (no API call yet)
//        //Controller returns Mono immediately
//        //Controller execution ends (no further role)
//        //Spring receives the returned Mono
//        //Spring internally subscribes
//        //API call is triggered after subscription
//        //Response arrives
//        //Body is converted to required type (String)
//        //Spring sends response to client
//        //--------------------------------------------------
//
//        //extract and return response
//
//        return extractResponseContent(response);
//
//    }
//
//    private String extractResponseContent(String response) {
//        try{
//            ObjectMapper mapper = new ObjectMapper();
//            JsonNode root = mapper.readTree(response);
//            return root.path("candidates")
//                    .get(0)
//                    .path("content")
//                    .path("parts")
//                    .get(0)
//                    .path("text")
//                    .asText();
//        }catch (Exception e){
//            return "Error Processing Request: "+ e.getMessage();
//        }
//    }
//
//    private String buildPrompt(EmailRequest emailRequest) {
//        StringBuilder prompt = new StringBuilder();
//        prompt.append("Generate a professional email reply for the following email content. Please don't generate a subject line");
//        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
//            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
//        }
//        prompt.append("\n Original Email : \n").append(emailRequest.getEmailContent());
//        return prompt.toString();
//    }
//}
