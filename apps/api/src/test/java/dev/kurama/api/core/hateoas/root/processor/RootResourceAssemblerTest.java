package dev.kurama.api.core.hateoas.root.processor;

import dev.kurama.api.core.hateoas.root.model.RootResource;
import dev.kurama.api.core.utility.AuthorityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.http.HttpMethod;

import static dev.kurama.api.core.authority.AdminAuthority.ADMIN_ROOT;
import static dev.kurama.api.core.authority.UserAuthority.PROFILE_READ;
import static dev.kurama.api.core.constant.RestPathConstant.*;
import static dev.kurama.api.core.hateoas.relations.AdministrationRelations.ADMINISTRATION_REL;
import static dev.kurama.api.core.hateoas.relations.AuthenticationRelations.*;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.DEFAULT;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static dev.kurama.api.core.hateoas.relations.UserRelations.CURRENT_USER_REL;
import static dev.kurama.api.core.rest.AuthenticationController.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.hateoas.MediaTypes.HAL_FORMS_JSON;

class RootResourceAssemblerTest {

  private MockedStatic<AuthorityUtils> authorityUtils;

  private RootResourceAssembler assembler;

  @BeforeEach
  void setUp() {
    assembler = new RootResourceAssembler();

    authorityUtils = Mockito.mockStatic(AuthorityUtils.class);
  }

  @AfterEach
  void tearDown() {
    authorityUtils.close();
  }

  @Nested
  class UnauthenticatedUserRootResourceTests {
    @BeforeEach
    void setUp() {
      authorityUtils.when(AuthorityUtils::isAuthenticated)
        .thenReturn(false);
    }

    @Test
    void should_have_self_link() {
      RepresentationModel<RootResource> actual = assembler.assemble();

      assertThat(actual.getLinks()).hasSize(5);
      assertThat(actual.getLink(SELF)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(BASE_PATH))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).hasSize(2)
          .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
          .extracting("name", "httpMethod")
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains("root", HttpMethod.GET)));

    }

    @Test
    void should_have_login_link_and_affordance() {
      RepresentationModel<RootResource> actual = assembler.assemble();

      assertThat(actual.getLinks()).hasSize(5);
      assertThat(actual.getLink(LOGIN_REL)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(AUTHENTICATION_PATH + LOGIN_PATH))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).hasSize(1)
          .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
          .extracting("name", "httpMethod")
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains("login", HttpMethod.POST)));
    }

    @Test
    void should_have_signup_link_and_affordance() {
      RepresentationModel<RootResource> actual = assembler.assemble();

      assertThat(actual.getLinks()).hasSize(5);
      assertThat(actual.getLink(SIGNUP_REL)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(AUTHENTICATION_PATH + SIGNUP_PATH))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).hasSize(1)
          .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
          .extracting("name", "httpMethod")
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains("signup", HttpMethod.POST)));
    }

    @Test
    void should_have_activation_token_link_and_affordance() {
      RepresentationModel<RootResource> actual = assembler.assemble();

      assertThat(actual.getLinks()).hasSize(5);
      assertThat(actual.getLink(ACTIVATION_TOKEN_REL)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(AUTHENTICATION_PATH + TOKEN_PATH))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).hasSize(1)
          .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
          .extracting("name", "httpMethod")
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains("requestActivationToken", HttpMethod.POST)));
    }

    @Test
    void should_have_account_activation_link_and_affordance() {
      RepresentationModel<RootResource> actual = assembler.assemble();

      assertThat(actual.getLinks()).hasSize(5);
      assertThat(actual.getLink(ACTIVATE_ACCOUNT_REL)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(AUTHENTICATION_PATH + ACTIVATE_PATH))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).hasSize(1)
          .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
          .extracting("name", "httpMethod")
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains("activateAccount", HttpMethod.POST)));
    }
  }

  @Nested
  class AuthenticatedUserRootResourceTests {
    @BeforeEach
    void setUp() {
      authorityUtils.when(AuthorityUtils::isAuthenticated)
        .thenReturn(true);
    }

    @Test
    void should_have_self_link() {
      RepresentationModel<RootResource> actual = assembler.assemble();

      assertThat(actual.getLinks()).hasSize(1);
      assertThat(actual.getLink(SELF)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(BASE_PATH))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).hasSize(2)
          .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
          .extracting("name", "httpMethod")
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains(DEFAULT, HttpMethod.HEAD))
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains("root", HttpMethod.GET)));
    }

    @Test
    void should_have_administration_root_link() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(ADMIN_ROOT))
        .thenReturn(true);

      RepresentationModel<RootResource> actual = assembler.assemble();

      assertThat(actual.getLinks()).hasSize(2);
      assertThat(actual.getLink(ADMINISTRATION_REL)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(ADMINISTRATION_ROOT_PATH))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).hasSize(1)
          .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
          .extracting("name", "httpMethod")
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains("root", HttpMethod.GET)));
    }

    @Test
    void should_have_current_user_link() {
      authorityUtils.when(() -> AuthorityUtils.hasAuthority(PROFILE_READ))
        .thenReturn(true);

      RepresentationModel<RootResource> actual = assembler.assemble();

      assertThat(actual.getLinks()).hasSize(2);
      assertThat(actual.getLink(CURRENT_USER_REL)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(USER_PROFILE_PATH))
        .hasValueSatisfying(link -> assertThat(link.getAffordances()).hasSize(1)
          .extracting(affordance -> affordance.getAffordanceModel(HAL_FORMS_JSON))
          .extracting("name", "httpMethod")
          .anySatisfy(reqs -> assertThat(reqs.toList()).contains("get", HttpMethod.GET)));
    }
  }
}
