package uk.co.foundationsedge.fossnotes.interfaces.spacy;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import uk.co.foundationsedge.fossnotes.interfaces.spacy.dto.NamedEntityItem;
import uk.co.foundationsedge.fossnotes.interfaces.spacy.dto.NamedEntityRequest;

import java.util.List;

@Service
public class NamedEntityService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public NamedEntityService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<NamedEntityItem> namedEntitiesFor(String text) {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        var body = new HttpEntity<>(new NamedEntityRequest(text, "en"), headers);
        try {
            var response = restTemplate.exchange(
                    "http://localhost:8091/ent",
                    HttpMethod.POST,
                    body,
                    String.class);
            if(!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("failed to get named entities for note [" + text + "]");
            }
            return objectMapper.readValue(response.getBody(),
                    new TypeReference<List<NamedEntityItem>>() {});
        } catch(Exception e) {
            e.printStackTrace();
            throw new RuntimeException("failed to get named entities for note [" + text + "]", e);
        }


    }
}
